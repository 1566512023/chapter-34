import { useEffect } from "react";
import type { ChapterItem } from "@/data/chapters";
import { useRouterState } from "@tanstack/react-router";
import { recordDiscovery } from "@/lib/inventory";
import { chapterImage } from "@/data/chapter-images";

interface Props {
  item: ChapterItem | null;
  onClose: () => void;
  accent?: string;
}

export function RevealModal({ item, onClose, accent = "oklch(0.85 0.13 82)" }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (!item) return;
    // Record discovery in the keepsake inventory.
    const chapterId = pathname.startsWith("/chapter/")
      ? pathname.slice("/chapter/".length)
      : "";
    if (chapterId) recordDiscovery(chapterId, item.id, item.title);
    // Pen easter egg: play the driving car when a Pen-themed memory opens.
    const haystack = `${item.title} ${item.body ?? ""} ${item.subtitle ?? ""}`;
    if (/\bPen\b/.test(haystack) && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("pen:drive"));
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose, pathname]);

  if (!item) return null;

  const chapterId = pathname.startsWith("/chapter/")
    ? pathname.slice("/chapter/".length)
    : "";
  const photo = item.image
    ? { url: item.image, alt: item.title }
    : chapterImage(chapterId, item.id);

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
        {photo && (
          <figure className="mt-6 flex justify-center overflow-hidden rounded-sm border border-current/10 bg-[color:var(--ink)]/5 shadow-lg">
            <img
              src={photo.url}
              alt={photo.alt}
              loading="lazy"
              className="max-h-[26rem] w-auto max-w-full object-contain"
            />
          </figure>
        )}
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
        {item.details && item.details.length > 0 && (
          <div className="mt-5 space-y-3">
            {item.details.map((d, i) => (
              <p
                key={i}
                className="font-display leading-relaxed text-[color:var(--ink)]/90"
              >
                {d}
              </p>
            ))}
          </div>
        )}
        {item.keepsakes && item.keepsakes.length > 0 && (
          <ul className="mt-6 space-y-2 border-t border-current/15 pt-5">
            {item.keepsakes.map((k, i) => (
              <li
                key={i}
                className="flex items-baseline gap-3 font-hand text-[color:var(--ink)]"
              >
                <span
                  className="shrink-0 font-display text-[0.65rem] uppercase tracking-[0.35em]"
                  style={{ color: accent }}
                >
                  {k.label}
                </span>
                <span className="text-[color:var(--ink-soft)]">— {k.note}</span>
              </li>
            ))}
          </ul>
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