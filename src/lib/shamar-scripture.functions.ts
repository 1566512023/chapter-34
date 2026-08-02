import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

/* ---------------- Saved Scripture / Reading Room ---------------- */

export const saveScripture = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        reference: z.string().trim().min(1).max(120),
        verse_text: z.string().trim().min(1).max(4000),
        translation: z.string().trim().max(20).optional(),
        theme: z.string().trim().max(80).optional().nullable(),
        reflection: z.string().trim().max(4000).optional().nullable(),
        journal_entry_id: z.string().uuid().optional().nullable(),
        prayer_id: z.string().uuid().optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase
      .from("saved_scriptures")
      .insert({
        user_id: context.userId,
        reference: data.reference,
        verse_text: data.verse_text,
        translation: data.translation ?? "WEB",
        theme: data.theme ?? null,
        reflection: data.reflection ?? null,
        journal_entry_id: data.journal_entry_id ?? null,
        prayer_id: data.prayer_id ?? null,
      })
      .select("id,reference,verse_text,translation,theme,reflection,created_at")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const listSavedScriptures = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("saved_scriptures")
      .select("id,reference,verse_text,translation,theme,reflection,journal_entry_id,prayer_id,created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateScriptureReflection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), reflection: z.string().trim().max(4000) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("saved_scriptures")
      .update({ reflection: data.reflection })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeSavedScripture = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("saved_scriptures").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------- Preferences (translation, daily card) ---------------- */

export const getPreferences = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_preferences")
      .select("translation,daily_scripture_dismissed_on")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ?? { translation: "WEB", daily_scripture_dismissed_on: null };
  });

export const savePreferences = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        translation: z.string().trim().max(20).optional(),
        daily_scripture_dismissed_on: z.string().trim().max(20).optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const payload = {
      user_id: context.userId,
      ...(data.translation ? { translation: data.translation } : {}),
      ...(data.daily_scripture_dismissed_on !== undefined
        ? { daily_scripture_dismissed_on: data.daily_scripture_dismissed_on }
        : {}),
    };
    const { error } = await context.supabase
      .from("user_preferences")
      .upsert(payload, { onConflict: "user_id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------- Memory suggestion dismissals ---------------- */

export const listDeclinedSuggestions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("memory_suggestion_dismissals")
      .select("suggestion_key");
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => r.suggestion_key as string);
  });

export const declineSuggestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ key: z.string().trim().min(1).max(80) }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("memory_suggestion_dismissals")
      .upsert(
        { user_id: context.userId, suggestion_key: data.key },
        { onConflict: "user_id,suggestion_key" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------- Memory search + On this day ---------------- */

export const searchMemories = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ q: z.string().trim().max(120) }).parse(d))
  .handler(async ({ context, data }) => {
    let query = context.supabase
      .from("user_memories")
      .select("id,title,memory_date,story,location,people,media_paths,category,visibility,tags,created_at")
      .order("memory_date", { ascending: false, nullsFirst: false })
      .limit(50);
    if (data.q) {
      const like = `%${data.q.replace(/[%,]/g, "")}%`;
      query = query.or(`title.ilike.${like},story.ilike.${like},location.ilike.${like}`);
    }
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const memoriesOnThisDay = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const now = new Date();
    const mmdd = `-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const { data, error } = await context.supabase
      .from("user_memories")
      .select("id,title,memory_date,story,media_paths")
      .not("memory_date", "is", null)
      .like("memory_date", `%${mmdd}`)
      .order("memory_date", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).filter((r) => (r.memory_date as string).slice(0, 4) !== String(now.getFullYear()));
  });

/** Milestone connections: only ever restates memories that actually exist. */
export const listMilestones = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_memories")
      .select("id,title,memory_date,category")
      .not("memory_date", "is", null)
      .order("memory_date", { ascending: true })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/* ---------------- Prayers: answered ---------------- */

export const markPrayerAnswered = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        answered: z.boolean(),
        answer_note: z.string().trim().max(2000).optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("user_prayers")
      .update({
        answered: data.answered,
        answered_at: data.answered ? new Date().toISOString() : null,
        answer_note: data.answer_note ?? null,
        waiting: data.answered ? false : true,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listPrayerWall = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_prayers")
      .select("id,title,request,note,waiting,answered,answered_at,answer_note,created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/* ---------------- Letters / time capsules ---------------- */

export const saveLetter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        title: z.string().trim().min(1).max(160),
        body: z.string().trim().min(1).max(20000),
        recipient: z.string().trim().max(120).optional().nullable(),
        open_on: z.string().trim().max(20).optional().nullable(),
        visibility: z.enum(["private", "family", "friends", "legacy"]).optional(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase
      .from("user_letters")
      .insert({
        user_id: context.userId,
        title: data.title,
        body: data.body,
        recipient: data.recipient ?? null,
        open_on: data.open_on || null,
        visibility: data.visibility ?? "private",
      })
      .select("id,title,recipient,open_on,visibility,created_at")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const listLetters = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_letters")
      .select("id,title,body,recipient,open_on,visibility,created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/* ---------------- What Shamar can actually retrieve ---------------- */

export const recallForShamar = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [memories, prayers, gratitude, journal, scriptures] = await Promise.all([
      context.supabase
        .from("user_memories")
        .select("title,memory_date,category")
        .order("created_at", { ascending: false })
        .limit(8),
      context.supabase
        .from("user_prayers")
        .select("title,waiting,answered")
        .order("created_at", { ascending: false })
        .limit(8),
      context.supabase
        .from("gratitude_entries")
        .select("body,category")
        .order("created_at", { ascending: false })
        .limit(5),
      context.supabase
        .from("journal_entries")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(3),
      context.supabase
        .from("saved_scriptures")
        .select("reference,theme")
        .order("created_at", { ascending: false })
        .limit(6),
    ]);
    return {
      memories: memories.data ?? [],
      prayers: prayers.data ?? [],
      gratitude: gratitude.data ?? [],
      journalCount: (journal.data ?? []).length,
      scriptures: scriptures.data ?? [],
    };
  });