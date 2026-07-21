import { useEffect, useState } from "react";
import { chapters } from "@/data/chapters";

const KEY = "phindile.journal.inventory";

export interface DiscoveryEntry {
  key: string;
  itemId: string;
  chapterId: string;
  chapterTitle: string;
  title: string;
  discoveredAt: string;
}

type Store = Record<string, DiscoveryEntry>;

const listeners = new Set<() => void>();

function read(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Store;
  } catch {
    return {};
  }
}

function write(data: Store) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function recordDiscovery(
  chapterId: string,
  itemId: string,
  title: string,
) {
  if (typeof window === "undefined") return;
  const data = read();
  const key = `${chapterId}::${itemId}`;
  if (data[key]) return;
  const chapter = chapters.find((c) => c.id === chapterId);
  data[key] = {
    key,
    itemId,
    chapterId,
    chapterTitle: chapter?.title ?? "",
    title,
    discoveredAt: new Date().toISOString(),
  };
  write(data);
}

export function clearInventory() {
  write({});
}

export function totalDiscoverable(): number {
  return chapters.reduce((n, c) => n + (c.items?.length ?? 0), 0);
}

function snapshot(): DiscoveryEntry[] {
  return Object.values(read()).sort((a, b) =>
    a.discoveredAt.localeCompare(b.discoveredAt),
  );
}

export function useInventory(): DiscoveryEntry[] {
  const [list, setList] = useState<DiscoveryEntry[]>([]);
  useEffect(() => {
    setList(snapshot());
    const cb = () => setList(snapshot());
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  }, []);
  return list;
}