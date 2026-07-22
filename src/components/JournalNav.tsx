import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { chapters } from "@/data/chapters";

const extras = [
  { label: "Home", to: "/" as const, params: undefined },
  { label: "Reading Room", to: "/journal" as const, params: undefined },
];

export function JournalNav() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const activeId = pathname.startsWith("/chapter/")
    ? pathname.slice("/chapter/".length)
    : null;

  return (
    <>
      {/* Floating ribbon trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close journal menu" : "Open journal menu"}
        aria-expanded={open}
        className="fixed right-4 top-4 z-[70] flex h-14 w-11 items-center justify-center rounded-b-[6px] border border-[oklch(0.78_0.09_60_/_0.6)] shadow-[0_10px_30px_rgba(120,80,60,0.3)] transition-transform hover:-translate-y-0.5 sm:right-6 sm:top-0 sm:h-16 sm:w-12"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.94 0.05 30) 0%, oklch(0.82 0.09 20) 60%, oklch(0.68 0.13 20) 100%)",
        }}
      >
        <span
          className="absolute inset-x-1 top-1 bottom-2 rounded-b-[4px] border border-[oklch(0.95_0.06_80_/_0.5)]"
          aria-hidden
        />
        <span
          className="relative font-display text-lg italic leading-none"
          style={{ color: "oklch(0.98 0.05 80)" }}
        >
          {open ? "×" : "❦"}
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

      {/* Slide-out panel */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Journal contents"
        className={`fixed right-0 top-0 z-[65] flex h-[100dvh] w-[92vw] max-w-sm flex-col border-l border-[oklch(0.78_0.09_60_/_0.5)] shadow-[-20px_0_60px_rgba(120,80,60,0.3)] transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background:
            "linear-gradient(180deg, oklch(0.97 0.02 80) 0%, oklch(0.9 0.05 25) 100%)",
        }}
      >
        {/* Inner gold border */}
        <div
          className="pointer-events-none absolute inset-3 rounded-sm border border-[oklch(0.75_0.1_60_/_0.45)]"
          aria-hidden
        />

        <header className="relative px-8 pt-10 pb-5">
          <p
            className="font-display text-[0.6rem] uppercase tracking-[0.5em]"
            style={{ color: "oklch(0.55 0.1 25)" }}
          >
            Table of Contents
          </p>
          <h2 className="mt-2 font-display text-3xl italic text-[oklch(0.35_0.08_25)]">
            Chapter 34
          </h2>
          <div className="mt-4 h-px w-16 bg-[oklch(0.7_0.11_60)]" />
        </header>

        <nav className="relative flex-1 overflow-y-auto px-6 pb-8">
          <ul className="space-y-1">
            {extras.map((e) => {
              const active = pathname === e.to;
              return (
                <li key={e.to}>
                  <Link
                    to={e.to}
                    className={`group flex items-center gap-3 rounded-sm px-3 py-2 font-display text-sm italic transition-colors ${
                      active
                        ? "bg-[oklch(0.75_0.1_60_/_0.25)] text-[oklch(0.35_0.1_25)]"
                        : "text-[oklch(0.5_0.08_25_/_0.85)] hover:text-[oklch(0.4_0.1_25)]"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-1 rounded-sm transition-opacity ${
                        active ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ background: "oklch(0.7 0.11 60)" }}
                      aria-hidden
                    />
                    <span className="uppercase tracking-[0.3em] text-[0.7rem]">
                      {e.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="my-5 h-px bg-[oklch(0.7_0.11_60_/_0.35)]" />

          <ul className="space-y-1">
            {chapters.map((c) => {
              const active = activeId === c.id;
              return (
                <li key={c.id}>
                  <Link
                    to="/chapter/$id"
                    params={{ id: c.id }}
                    className={`group relative flex items-baseline gap-3 rounded-sm py-2 pl-4 pr-3 transition-colors ${
                      active
                        ? "bg-[oklch(0.75_0.1_60_/_0.2)]"
                        : "hover:bg-[oklch(0.75_0.1_60_/_0.1)]"
                    }`}
                  >
                    {/* Bookmark ribbon */}
                    <span
                      className={`absolute left-0 top-1 h-8 w-1.5 rounded-r-sm transition-all ${
                        active
                          ? "opacity-100 shadow-[0_0_10px_oklch(0.7_0.13_25_/_0.6)]"
                          : "opacity-0 group-hover:opacity-40"
                      }`}
                      style={{ background: "oklch(0.65 0.14 25)" }}
                      aria-hidden
                    />
                    <span
                      className="w-16 shrink-0 font-display text-[0.6rem] uppercase tracking-[0.3em]"
                      style={{
                        color: active
                          ? "oklch(0.5 0.12 25)"
                          : "oklch(0.55 0.08 25 / 0.75)",
                      }}
                    >
                      {c.number.replace("Chapter ", "Ch. ")}
                    </span>
                    <span
                      className={`flex-1 font-display italic ${
                        active
                          ? "text-[oklch(0.32_0.09_25)]"
                          : "text-[oklch(0.4_0.08_25_/_0.9)] group-hover:text-[oklch(0.32_0.09_25)]"
                      }`}
                    >
                      {c.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <footer className="relative border-t border-[oklch(0.75_0.1_60_/_0.35)] px-6 py-4 text-center">
          <p
            className="font-hand text-xs"
            style={{ color: "oklch(0.5 0.08 25 / 0.85)" }}
          >
            Every Chapter Tells the Story of God's Faithfulness.
          </p>
        </footer>
      </aside>
    </>
  );
}