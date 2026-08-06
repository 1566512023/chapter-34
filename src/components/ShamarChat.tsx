import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { supabase } from "@/integrations/supabase/client";
import {
  createThread,
  listThreads,
  loadThreadMessages,
} from "@/lib/shamar-chat.functions";

type Thread = { id: string; title: string; updated_at: string };

const ink = "oklch(0.35 0.06 25)";
const soft = "oklch(0.52 0.07 25)";
const line = "oklch(0.85 0.07 85 / 0.6)";

/**
 * A quiet, invited conversation with Shamar. Rendered inside the Writing Desk —
 * it has no launcher, no branding block and no greeting monologue.
 */
export function ShamarChat({ chapterId }: { chapterId: string | null }) {
  const listFn = useServerFn(listThreads);
  const createFn = useServerFn(createThread);
  const loadFn = useServerFn(loadThreadMessages);

  const [threadId, setThreadId] = useState<string | null>(null);
  const [initial, setInitial] = useState<UIMessage[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const rows = (await listFn()) as Thread[];
      let id = rows[0]?.id ?? null;
      if (!id) {
        const t = (await createFn({ data: { title: "A quiet conversation" } })) as Thread;
        id = t.id;
      }
      if (cancelled) return;
      const msgs = await loadFn({ data: { threadId: id } });
      if (cancelled) return;
      setInitial(msgs.map((r) => ({ id: r.id, role: r.role, parts: r.parts })) as UIMessage[]);
      setThreadId(id);
      setReady(true);
    })().catch(() => setReady(true));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) {
    return (
      <p className="font-display text-sm italic" style={{ color: soft }}>
        One moment…
      </p>
    );
  }

  return <Conversation key={threadId ?? "none"} threadId={threadId} chapterId={chapterId} initial={initial} />;
}

function Conversation({
  threadId,
  chapterId,
  initial,
}: {
  threadId: string | null;
  chapterId: string | null;
  initial: UIMessage[];
}) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        fetch: async (url, init) => {
          const { data } = await supabase.auth.getSession();
          const token = data.session?.access_token;
          const headers = new Headers(init?.headers);
          if (token) headers.set("Authorization", `Bearer ${token}`);
          return fetch(url as RequestInfo, { ...init, headers });
        },
        prepareSendMessagesRequest: ({ messages, body }) => ({
          body: { messages, threadId, chapterId, ...(body ?? {}) },
        }),
      }),
    [threadId, chapterId],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: threadId ?? undefined,
    messages: initial,
    transport,
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);
  useEffect(() => {
    inputRef.current?.focus();
  }, [threadId, status]);

  const busy = status === "submitted" || status === "streaming";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || !threadId || busy) return;
    setInput("");
    await sendMessage({ text });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden pr-1">
        {messages.length === 0 && (
          <p className="font-display text-lg italic" style={{ color: ink, overflowWrap: "anywhere" }}>
            How can I help you preserve this chapter today?
          </p>
        )}
        {messages.map((m) => {
          const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
          const isUser = m.role === "user";
          return (
            <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm"
                style={
                  isUser
                    ? { background: "oklch(0.6 0.13 20)", color: "white", overflowWrap: "anywhere" }
                    : { color: ink, overflowWrap: "anywhere" }
                }
              >
                {text}
              </div>
            </div>
          );
        })}
        {status === "submitted" && (
          <p className="font-display text-sm italic" style={{ color: soft }}>
            Shamar is listening…
          </p>
        )}
        {error && <p className="text-xs text-red-700">{error.message}</p>}
      </div>

      <form
        onSubmit={submit}
        className="flex items-end gap-2 rounded-xl border bg-white/70 p-2"
        style={{ borderColor: line }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(e as unknown as React.FormEvent);
            }
          }}
          rows={2}
          placeholder="Ask quietly…"
          disabled={!threadId || busy}
          className="flex-1 resize-none bg-transparent px-2 py-1 text-sm outline-none"
          style={{ color: ink }}
        />
        <button
          type="submit"
          disabled={!threadId || busy || !input.trim()}
          className="rounded-md px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white transition disabled:opacity-50"
          style={{ background: "oklch(0.6 0.13 20)" }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
