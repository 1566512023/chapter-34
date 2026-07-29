import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  listDreams,
  createDream,
  deleteDream,
  listPrayers,
  createPrayer,
  deletePrayer,
  listPeople,
  createPerson,
  deletePerson,
} from "./user-content.functions";

export type Dream = Awaited<ReturnType<typeof listDreams>>[number];
export type Prayer = Awaited<ReturnType<typeof listPrayers>>[number];
export type Person = Awaited<ReturnType<typeof listPeople>>[number];

export function useAuthed() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) setAuthed(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);
  return authed;
}

export function useDreams() {
  const authed = useAuthed();
  const [items, setItems] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(false);
  const refresh = useCallback(async () => {
    if (!authed) return setItems([]);
    setLoading(true);
    try { setItems(await listDreams()); } finally { setLoading(false); }
  }, [authed]);
  useEffect(() => { void refresh(); }, [refresh]);
  const add = async (input: { title: string; promise?: string; note?: string }) => {
    const row = await createDream({ data: input });
    setItems((p) => [...p, row]);
  };
  const remove = async (id: string) => {
    await deleteDream({ data: { id } });
    setItems((p) => p.filter((r) => r.id !== id));
  };
  return { items, add, remove, loading, authed };
}

export function usePrayers() {
  const authed = useAuthed();
  const [items, setItems] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(false);
  const refresh = useCallback(async () => {
    if (!authed) return setItems([]);
    setLoading(true);
    try { setItems(await listPrayers()); } finally { setLoading(false); }
  }, [authed]);
  useEffect(() => { void refresh(); }, [refresh]);
  const add = async (input: { title: string; request?: string; note?: string }) => {
    const row = await createPrayer({ data: input });
    setItems((p) => [...p, row]);
  };
  const remove = async (id: string) => {
    await deletePrayer({ data: { id } });
    setItems((p) => p.filter((r) => r.id !== id));
  };
  return { items, add, remove, loading, authed };
}

export function usePeople() {
  const authed = useAuthed();
  const [items, setItems] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const refresh = useCallback(async () => {
    if (!authed) return setItems([]);
    setLoading(true);
    try { setItems(await listPeople()); } finally { setLoading(false); }
  }, [authed]);
  useEffect(() => { void refresh(); }, [refresh]);
  const add = async (input: { name: string; relation?: string; note?: string; bloom_color?: string }) => {
    const row = await createPerson({ data: input });
    setItems((p) => [...p, row]);
  };
  const remove = async (id: string) => {
    await deletePerson({ data: { id } });
    setItems((p) => p.filter((r) => r.id !== id));
  };
  return { items, add, remove, loading, authed };
}