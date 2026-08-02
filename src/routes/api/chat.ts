import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { buildShamarSystem } from "@/lib/shamar";
import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

type Body = { messages?: unknown; threadId?: unknown; chapterId?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, threadId, chapterId } = (await request.json()) as Body;
        if (!Array.isArray(messages) || typeof threadId !== "string") {
          return new Response("Bad request", { status: 400 });
        }

        const authHeader = request.headers.get("authorization") ?? "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
        if (!token || token.split(".").length !== 3) {
          return new Response("Unauthorized", { status: 401 });
        }

        const SUPABASE_URL = process.env.SUPABASE_URL!;
        const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;
        const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          global: {
            headers: { Authorization: `Bearer ${token}`, apikey: SUPABASE_PUBLISHABLE_KEY },
          },
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
        });
        const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
        if (claimsErr || !claimsData?.claims?.sub) {
          return new Response("Unauthorized", { status: 401 });
        }
        const userId = claimsData.claims.sub as string;

        // Verify thread ownership.
        const { data: thread, error: threadErr } = await supabase
          .from("shamar_threads")
          .select("id")
          .eq("id", threadId)
          .maybeSingle();
        if (threadErr || !thread) {
          return new Response("Thread not found", { status: 404 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        const gateway = createLovableAiGatewayProvider(key);

        const uiMessages = messages as UIMessage[];

        // Persist the latest user message immediately.
        const lastUser = [...uiMessages].reverse().find((m) => m.role === "user");
        const lastUserText = lastUser
          ? (lastUser.parts as { type: string; text?: string }[])
              .filter((p) => p.type === "text")
              .map((p) => p.text ?? "")
              .join(" ")
          : "";
        if (lastUser) {
          await supabase.from("shamar_messages").insert({
            thread_id: threadId,
            user_id: userId,
            role: "user",
            parts: lastUser.parts as unknown as object,
          });
          await supabase
            .from("shamar_threads")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", threadId);
        }

        // Only what she has actually saved — Shamar never invents history.
        const [mem, pray, grat, scrip] = await Promise.all([
          supabase.from("user_memories").select("title,memory_date,category").order("created_at", { ascending: false }).limit(8),
          supabase.from("user_prayers").select("title,waiting,answered").order("created_at", { ascending: false }).limit(8),
          supabase.from("gratitude_entries").select("body,category").order("created_at", { ascending: false }).limit(5),
          supabase.from("saved_scriptures").select("reference,theme").order("created_at", { ascending: false }).limit(6),
        ]);

        const result = streamText({
          model: gateway("google/gemini-2.5-flash"),
          system: buildShamarSystem({
            chapterId: typeof chapterId === "string" ? chapterId : null,
            lastUserText,
            recall: {
              memories: mem.data ?? [],
              prayers: pray.data ?? [],
              gratitude: grat.data ?? [],
              savedScriptures: scrip.data ?? [],
            },
          }),
          messages: convertToModelMessages(uiMessages),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: uiMessages,
          onFinish: async ({ messages: finalMessages }) => {
            const assistant = [...finalMessages].reverse().find((m) => m.role === "assistant");
            if (!assistant) return;
            await supabase.from("shamar_messages").insert({
              thread_id: threadId,
              user_id: userId,
              role: "assistant",
              parts: assistant.parts as unknown as object,
            });
            await supabase
              .from("shamar_threads")
              .update({ updated_at: new Date().toISOString() })
              .eq("id", threadId);
          },
        });
      },
    },
  },
});