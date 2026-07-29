import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

/* ------------- Dreams ------------- */

const DreamInput = z.object({
  title: z.string().trim().min(1).max(120),
  promise: z.string().trim().max(300).optional().nullable(),
  note: z.string().trim().max(1000).optional().nullable(),
});

export const listDreams = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_dreams")
      .select("id,title,promise,note,created_at")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createDream = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => DreamInput.parse(d))
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase
      .from("user_dreams")
      .insert({
        user_id: context.userId,
        title: data.title,
        promise: data.promise ?? null,
        note: data.note ?? null,
      })
      .select("id,title,promise,note,created_at")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteDream = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("user_dreams").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------- Prayers ------------- */

const PrayerInput = z.object({
  title: z.string().trim().min(1).max(120),
  request: z.string().trim().max(300).optional().nullable(),
  note: z.string().trim().max(1000).optional().nullable(),
});

export const listPrayers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_prayers")
      .select("id,title,request,note,created_at")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createPrayer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => PrayerInput.parse(d))
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase
      .from("user_prayers")
      .insert({
        user_id: context.userId,
        title: data.title,
        request: data.request ?? null,
        note: data.note ?? null,
      })
      .select("id,title,request,note,created_at")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deletePrayer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("user_prayers").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------- People ------------- */

const PersonInput = z.object({
  name: z.string().trim().min(1).max(80),
  relation: z.string().trim().max(80).optional().nullable(),
  note: z.string().trim().max(500).optional().nullable(),
  bloom_color: z.string().trim().max(40).optional().nullable(),
});

export const listPeople = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_people")
      .select("id,name,relation,note,bloom_color,created_at")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createPerson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => PersonInput.parse(d))
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase
      .from("user_people")
      .insert({
        user_id: context.userId,
        name: data.name,
        relation: data.relation ?? null,
        note: data.note ?? null,
        bloom_color: data.bloom_color ?? null,
      })
      .select("id,name,relation,note,bloom_color,created_at")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deletePerson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("user_people").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });