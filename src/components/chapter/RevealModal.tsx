import { useEffect } from "react";
import type { ChapterItem } from "@/data/chapters";

interface Props {
  item: ChapterItem | null;
  onClose: () => void;
  accent?: string;
}

export function RevealModal({ item, onClose, accent = "oklch(0.85 0.13 82)" }: Props) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />
      <article
        onClick={(e) => e.stopPropagation()}
        className="paper relative z-10 mx-auto w-full max-w-lg rounded-sm px-8 py-10 shadow-2xl page-in"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-3 font-display text-2xl text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]"
          aria-label="Close"
        >
          ×
        </button>
        {item.subtitle && (
          <p
            className="font-display text-xs uppercase tracking-[0.4em]"
            style={{ color: accent }}
          >
            {item.subtitle}
          </p>
        )}
        <h2 className="mt-2 font-display text-3xl italic text-[color:var(--ink)]">
          {item.title}
        </h2>
        <div className="mt-4 h-px w-16" style={{ background: accent }} />
        {item.scripture && (
          <p className="mt-6 font-display italic text-[color:var(--ink-soft)]">
            {item.scripture}
          </p>
        )}
        {item.body && (
          <p className="mt-6 font-display text-lg leading-relaxed text-[color:var(--ink)]">
            {item.body}
          </p>
        )}
        {item.placeholder && (
          <p className="mt-6 font-hand text-sm text-[color:var(--ink-soft)]">
            A place kept open — add a photograph or memory here.
          </p>
        )}
      </article>
    </div>
  );
}