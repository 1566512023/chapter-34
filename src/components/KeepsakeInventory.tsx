import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useInventory, totalDiscoverable, type DiscoveryEntry } from "@/lib/inventory";

function groupByChapter(list: DiscoveryEntry[]) {
  const map = new Map<string, { chapterId: string; chapterTitle: string; items: DiscoveryEntry[] }>();
  for (const e of list) {
    const g = map.get(e.chapterId) ?? { chapterId: e.chapterId, chapterTitle: e.chapterTitle, items: [] };
    g.items.push(e);
    map.set(e.chapterId, g);
  }
  return Array.from(map.values());
}

export function KeepsakeInventory() {
  const [open, setOpen] = useState(false);
  const list = useInventory();
  const total = totalDiscoverable();
  const found = list.length;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const groups = groupByChapter(list);

  return (
    <>
      {/* Floating trigger — sits just below the journal ribbon */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close keepsake inventory" : "Open keepsake inventory"}
        aria-expanded={open}
        className="fixed right-4 top-[5.5rem] z-[70] flex items-center gap-2 rounded-full border border-[oklch(0.7_0.15_78_/_0.55)] px-3 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-transform hover:-translate-y-0.5 sm:right-6 sm:top-[5rem]"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.32 0.08 40) 0%, oklch(0.18 0.05 35) 100%)",
        }}
      >
        <span className="font-display text-base leading-none" style={{ color: "oklch(0.9 0.13 78)" }}>
          ✦
        </span>
        <span
          className="font-display text-[0.65rem] italic uppercase tracking-[0.25em]"
          style={{ color: "oklch(0.9 0.1 78)" }}
        >
          Keepsakes {found}/{total}
        </span>
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      />

      {/* Slide-out panel from the LEFT so it does not clash with JournalNav */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Keepsake inventory"
        className={`fixed left-0 top-0 z-[65] flex h-[100dvh] w-[92vw] max-w-sm flex-col border-r border-[oklch(0.7_0.15_78_/_0.4)] shadow-[20px_0_60px_rgba(0,0,0,0.55)] transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background:
            "linear-gradient(180deg, oklch(0.22 0.06 35) 0%, oklch(0.14 0.04 30) 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-3 rounded-sm border border-[oklch(0.85_0.13_78_/_0.3)]" aria-hidden />

        <header className="relative px-8 pt-10 pb-4">
          <p className="font-display text-[0.6rem] uppercase tracking-[0.5em]" style={{ color: "oklch(0.85 0.13 78)" }}>
            Keepsake Inventory
          </p>
          <h2 className="mt-2 font-display text-3xl italic text-[oklch(0.95_0.05_82)]">
            What You've Found
          </h2>
          <p className="mt-2 font-hand text-sm text-[oklch(0.85_0.08_82_/_0.75)]">
            {found} of {total} discoveries opened
          </p>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[oklch(0.85_0.13_78_/_0.15)]">
            <div
              className="h-full rounded-full transition-[width] duration-700"
              style={{
                width: `${total ? (found / total) * 100 : 0}%`,
                background: "linear-gradient(90deg, oklch(0.6 0.13 78), oklch(0.9 0.15 82))",
              }}
            />
          </div>
        </header>

        <div className="relative flex-1 overflow-y-auto px-6 pb-8">
          {found === 0 && (
            <p className="mx-2 mt-8 font-display italic text-[oklch(0.9_0.05_82_/_0.7)]">
              No keepsakes yet. Wander a chapter and open a memory — everything you discover will be gathered here.
            </p>
          )}

          <ul className="space-y-6">
            {groups.map((g) => (
              <li key={g.chapterId}>
                <Link
                  to="/chapter/$id"
                  params={{ id: g.chapterId }}
                  onClick={() => setOpen(false)}
                  className="font-display text-[0.6rem] uppercase tracking-[0.35em] text-[oklch(0.85_0.13_78)] hover:text-[oklch(0.98_0.15_82)]"
                >
                  {g.chapterTitle}
                </Link>
                <ul className="mt-2 space-y-1.5 border-l border-[oklch(0.85_0.13_78_/_0.25)] pl-3">
                  {g.items.map((it) => (
                    <li
                      key={it.key}
                      className="flex items-baseline gap-2 font-display italic text-[oklch(0.95_0.06_82)]"
                    >
                      <span className="text-[oklch(0.85_0.13_78)]">✦</span>
                      <span>{it.title}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        <footer className="relative border-t border-[oklch(0.85_0.13_78_/_0.2)] px-6 py-4 text-center">
          <p className="font-hand text-xs" style={{ color: "oklch(0.85 0.08 82 / 0.7)" }}>
            Every discovery is a keepsake. Every keepsake is a small mercy.
          </p>
        </footer>
      </aside>
    </>
  );
}