import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  contextForChapter,
  shamarBlessing,
  shamarGreeting,
  todaysEncouragement,
} from "@/lib/shamar";

export function ShamarCompanion() {
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const activeId = pathname.startsWith("/chapter/")
    ? pathname.slice("/chapter/".length)
    : null;
  const ctx = contextForChapter(activeId);
  const encouragement = hydrated ? todaysEncouragement() : "";

  return (
    <>
      {/* Floating Shamar trigger — bottom-left corner */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Shamar" : "Open Shamar, keeper of every chapter"}
        aria-expanded={open}
        className="fixed bottom-5 left-4 z-[72] flex items-center gap-2 rounded-full border border-[oklch(0.78_0.09_60_/_0.6)] px-4 py-2 shadow-[0_10px_30px_rgba(120,80,60,0.3)] transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:left-6"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.96 0.03 80) 0%, oklch(0.88 0.05 30) 100%)",
        }}
      >
        <span
          className="font-display text-lg italic leading-none"
          style={{ color: "oklch(0.5 0.1 25)" }}
          aria-hidden
        >
          שָׁמַר
        </span>
        <span
          className="font-display text-[0.65rem] uppercase tracking-[0.3em]"
          style={{ color: "oklch(0.45 0.08 25)" }}
        >
          {open ? "Close" : "Shamar"}
        </span>
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[68] bg-[oklch(0.2_0.03_25_/_0.35)] backdrop-blur-sm transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      />

      {/* Slide-up companion panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shamar — Keeper of Every Chapter"
        className={`fixed bottom-0 left-0 z-[71] w-full max-w-md rounded-t-2xl border border-[oklch(0.78_0.09_60_/_0.5)] p-6 shadow-[0_-20px_60px_rgba(120,80,60,0.3)] transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] sm:bottom-6 sm:left-6 sm:rounded-2xl ${
          open ? "translate-y-0" : "translate-y-[110%]"
        }`}
        style={{
          background:
            "linear-gradient(180deg, oklch(0.97 0.02 80) 0%, oklch(0.92 0.04 30) 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-2 rounded-xl border border-[oklch(0.75_0.1_60_/_0.35)]" aria-hidden />

        <header className="relative">
          <p className="font-display text-[0.6rem] uppercase tracking-[0.5em] text-[oklch(0.5_0.1_25)]">
            שָׁמַר · Shamar
          </p>
          <h2 className="mt-1 font-display text-2xl italic text-[oklch(0.35_0.08_25)]">
            Keeper of Every Chapter
          </h2>
          <div className="mt-3 h-px w-16 bg-[oklch(0.7_0.11_60)]" />
        </header>

        <div className="relative mt-4 max-h-[55vh] space-y-4 overflow-y-auto pr-1">
          <div className="space-y-1 font-display text-[color:oklch(0.35_0.06_25)]">
            {shamarGreeting.map((line, i) => (
              <p key={i} className={i === 0 ? "italic" : ""}>
                {line}
              </p>
            ))}
          </div>

          <div className="rounded-md border border-[oklch(0.75_0.1_60_/_0.35)] bg-[oklch(0.98_0.02_80_/_0.6)] p-4">
            <p className="font-display text-[0.6rem] uppercase tracking-[0.4em] text-[oklch(0.55_0.1_25)]">
              Today's Reflection
            </p>
            <p className="mt-2 font-hand text-base text-[oklch(0.35_0.08_25)]">
              {encouragement || "\u00a0"}
            </p>
          </div>

          <div className="rounded-md border border-[oklch(0.75_0.1_60_/_0.35)] bg-[oklch(0.98_0.02_80_/_0.6)] p-4">
            <p className="font-display text-[0.6rem] uppercase tracking-[0.4em] text-[oklch(0.55_0.1_25)]">
              {ctx.title}
            </p>
            <p className="mt-2 font-display italic text-[oklch(0.35_0.08_25)]">
              {ctx.prompt}
            </p>
            {ctx.scripture && (
              <p className="mt-2 font-display text-xs uppercase tracking-[0.3em] text-[oklch(0.55_0.1_25)]">
                {ctx.scripture}
              </p>
            )}
          </div>

          <p className="font-hand text-sm italic text-[oklch(0.5_0.08_25)]">
            {shamarBlessing}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-3 font-display text-xl text-[oklch(0.5_0.1_25)] hover:text-[oklch(0.35_0.1_25)]"
          aria-label="Close Shamar"
        >
          ×
        </button>
      </aside>
    </>
  );
}