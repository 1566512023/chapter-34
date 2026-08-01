import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

/* ---------------- Journal ---------------- */

export const saveJournalEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        body: z.string().trim().min(1).max(20000),
        scripture: z.string().trim().max(300).optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase
      .from("journal_entries")
      .insert({
        user_id: context.userId,
        body: data.body,
        scripture: data.scripture ?? null,
      })
      .select("id,body,scripture,created_at")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const attachJournalScripture = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), scripture: z.string().trim().min(1).max(300) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("journal_entries")
      .update({ scripture: data.scripture })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------- Memory ---------------- */

export const saveMemory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        title: z.string().trim().min(1).max(160),
        memory_date: z.string().trim().max(20).optional().nullable(),
        story: z.string().trim().max(10000).optional().nullable(),
        location: z.string().trim().max(160).optional().nullable(),
        people: z.array(z.string().trim().max(80)).max(30).optional(),
        media_paths: z.array(z.string().trim().max(300)).max(20).optional(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase
      .from("user_memories")
      .insert({
        user_id: context.userId,
        title: data.title,
        memory_date: data.memory_date || null,
        story: data.story ?? null,
        location: data.location ?? null,
        people: data.people ?? [],
        media_paths: data.media_paths ?? [],
      })
      .select("id,title,memory_date,created_at")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

/* ---------------- Prayer ---------------- */

export const savePrayerEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ request: z.string().trim().min(1).max(5000) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const title = data.request.split("\n")[0]?.slice(0, 110) || "A prayer";
    const { data: row, error } = await context.supabase
      .from("user_prayers")
      .insert({ user_id: context.userId, title, request: data.request.slice(0, 300), note: data.request })
      .select("id,title,created_at")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const markPrayerWaiting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), waiting: z.boolean() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("user_prayers")
      .update({ waiting: data.waiting })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------- Gratitude ---------------- */

export const saveGratitude = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        body: z.string().trim().min(1).max(5000),
        category: z.string().trim().max(60).optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase
      .from("gratitude_entries")
      .insert({ user_id: context.userId, body: data.body, category: data.category ?? null })
      .select("id,body,category,created_at")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });