import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { chapters, dedication } from "@/data/chapters";
import { writeBookmark } from "@/lib/bookmark";

const searchSchema = z.object({
  p: z.string().optional(),
});

export const Route = createFileRoute("/journal")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "The Journal — Phindile · Chapter 34" },
      {
        name: "description",
        content:
          "Turn the pages of a treasured leather-bound journal — every chapter a story of God's faithfulness.",
      },
      { property: "og:title", content: "The Journal — Phindile" },
      {
        property: "og:description",
        content: "Every Chapter Tells the Story of God's Faithfulness.",
      },
    ],
  }),
  component: JournalReader,
});

/** Ordered list of page ids that make up the journal. */
const pageIds = ["dedication", ...chapters.map((c) => c.id), "closing"] as const;
type PageId = (typeof pageIds)[number];

function JournalReader() {
  const { p } = useSearch({ from: "/journal" });
  const navigate = useNavigate({ from: "/journal" });
  const initial: PageId = (pageIds as readonly string[]).includes(p ?? "")
    ? (p as PageId)
    : "dedication";

  const [current, setCurrent] = useState<PageId>(initial);
  const [turning, setTurning] = useState<"in" | "out" | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const stagedRef = useRef<PageId | null>(null);

  // Persist bookmark whenever a new page settles.
  useEffect(() => {
    writeBookmark(current);
    navigate({ search: { p: current }, replace: true });
    // scroll to top on new page
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [current, navigate]);

  const goTo = (id: PageId) => {
    if (turning || id === current) return;
    const currentIdx = pageIds.indexOf(current);
    const nextIdx = pageIds.indexOf(id);
    setDirection(nextIdx >= currentIdx ? 1 : -1);
    stagedRef.current = id;
    setTurning("out");
    window.setTimeout(() => {
      setCurrent(id);
      setTurning("in");
      window.setTimeout(() => setTurning(null), 900);
    }, 700);
  };

  const currentIndex = pageIds.indexOf(current);
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < pageIds.length - 1;

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at top, #241610 0%, #120a06 60%, #0a0503 100%)",
      }}
    >
      {/* Ambient candle glow at edges */}
      <div
        className="pointer-events-none absolute inset-0 candle-glow"
        style={{
          background:
            "radial-gradient(ellipse 40% 60% at 8% 30%, oklch(0.75 0.14 55 / 0.15), transparent 60%), radial-gradient(ellipse 40% 60% at 92% 70%, oklch(0.75 0.14 55 / 0.1), transparent 60%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12 sm:px-8 sm:py-16">
        {/* The open book spread */}
        <div className="relative w-full" style={{ perspective: "2500px" }}>
          <BookSpread turning={turning}>
            <PageContent id={current} onGoTo={goTo} />
          </BookSpread>

          {/* Navigation ribbons — always visible, quiet */}
          <div className="mt-8 flex items-center justify-between text-[oklch(0.78_0.06_78_/_0.65)]">
            <button
              type="button"
              onClick={() => canPrev && goTo(pageIds[currentIndex - 1]!)}
              disabled={!canPrev || !!turning}
              className="group flex items-center gap-2 font-display italic tracking-wide transition-all disabled:opacity-30 hover:text-[oklch(0.85_0.13_82)]"
            >
              <span className="text-lg">‹</span>
              <span className="text-sm">previous page</span>
            </button>

            <div className="hidden font-display text-xs tracking-[0.3em] uppercase sm:block">
              {currentIndex === 0
                ? "Dedication"
                : currentIndex === pageIds.length - 1
                  ? "Final Page"
                  : `Page ${currentIndex} of ${pageIds.length - 1}`}
            </div>

            <button
              type="button"
              onClick={() => canNext && goTo(pageIds[currentIndex + 1]!)}
              disabled={!canNext || !!turning}
              className="group flex items-center gap-2 font-display italic tracking-wide transition-all disabled:opacity-30 hover:text-[oklch(0.85_0.13_82)]"
            >
              <span className="text-sm">turn the page</span>
              <span className="text-lg">›</span>
            </button>
          </div>

          {/* Chapter index bookmarks */}
          <ChapterRibbons current={current} onGoTo={goTo} />
        </div>
      </div>
    </div>
  );
}

function BookSpread({
  children,
  turning,
}: {
  children: React.ReactNode;
  turning: "in" | "out" | null;
}) {
  return (
    <div
      className="relative mx-auto w-full max-w-3xl"
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* Leather book shadow behind the page */}
      <div
        className="absolute -inset-6 -z-10 rounded-[6px]"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.24 0.05 40), oklch(0.16 0.04 40))",
          boxShadow:
            "0 60px 100px rgba(0,0,0,0.6), inset 0 0 50px rgba(0,0,0,0.5)",
        }}
      />

      <article
        key={turning ?? "idle"}
        className={[
          "paper relative mx-auto min-h-[70vh] rounded-[2px] px-6 py-14 sm:px-16 sm:py-20 md:min-h-[75vh] md:px-24 md:py-24",
          turning === "out" ? "page-out" : "page-in",
        ].join(" ")}
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
      >
        {/* Ruled binding shadow on the left */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-6"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.35 0.08 40 / 0.35), transparent)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-6"
          style={{
            background:
              "linear-gradient(270deg, oklch(0.35 0.08 40 / 0.2), transparent)",
          }}
        />

        {children}
      </article>
    </div>
  );
}

function PageContent({
  id,
  onGoTo,
}: {
  id: PageId;
  onGoTo: (id: PageId) => void;
}) {
  if (id === "dedication") return <DedicationPage onBegin={() => onGoTo("prologue")} />;
  if (id === "closing") return <ClosingPage onContinue={() => onGoTo("dedication")} />;
  const chapter = chapters.find((c) => c.id === id);
  if (!chapter) return null;
  const idx = chapters.findIndex((c) => c.id === id);
  const next = chapters[idx + 1];
  return (
    <ChapterPage
      chapter={chapter}
      onContinue={() => onGoTo(next ? (next.id as PageId) : "closing")}
      isLast={!next}
    />
  );
}

function DedicationPage({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center text-center">
      <p className="font-script gold-text text-4xl sm:text-5xl ink-in">
        {dedication.greeting}
      </p>
      <div className="mt-8 h-px w-24 bg-[oklch(0.55_0.1_60_/_0.4)]" />

      <div className="mt-10 space-y-6 font-display text-[1.05rem] leading-relaxed text-[color:var(--ink)] sm:text-lg">
        {dedication.paragraphs.map((p, i) => (
          <p key={i} className="ink-in" style={{ animationDelay: `${0.2 + i * 0.15}s` }}>
            {p}
          </p>
        ))}
      </div>

      <p
        className="mt-10 font-script text-2xl gold-text ink-in"
        style={{ animationDelay: "1.2s" }}
      >
        {dedication.motto}
      </p>

      <p
        className="mt-10 whitespace-pre-line font-hand text-lg text-[color:var(--ink-soft)] ink-in"
        style={{ animationDelay: "1.5s" }}
      >
        {dedication.signature}
      </p>

      <button
        type="button"
        onClick={onBegin}
        className="btn-ink mt-14 ink-in"
        style={{ animationDelay: "1.8s" }}
      >
        Begin Reading
      </button>
    </div>
  );
}

function ChapterPage({
  chapter,
  onContinue,
  isLast,
}: {
  chapter: (typeof chapters)[number];
  onContinue: () => void;
  isLast: boolean;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col text-center">
      <p
        className="font-display text-xs uppercase tracking-[0.4em] text-[color:var(--ink-soft)] ink-in"
        style={{ animationDelay: "0.05s" }}
      >
        {chapter.number}
      </p>
      <h1
        className="mt-4 font-display text-4xl italic text-[color:var(--ink)] sm:text-5xl gold-underline ink-in"
        style={{ animationDelay: "0.2s" }}
      >
        {chapter.title}
      </h1>

      {chapter.verse && (
        <p
          className="mt-8 font-display italic text-[color:var(--ink-soft)] ink-in"
          style={{ animationDelay: "0.4s" }}
        >
          {chapter.verse}
        </p>
      )}

      {chapter.theme && (
        <p
          className="mt-6 font-hand text-xl text-[color:var(--ink)] ink-in"
          style={{ animationDelay: "0.55s" }}
        >
          {chapter.theme}
        </p>
      )}

      <div className="mt-10 space-y-5 font-display text-lg leading-relaxed text-[color:var(--ink)]">
        {chapter.body.map((line, i) => (
          <p key={i} className="ink-in" style={{ animationDelay: `${0.7 + i * 0.12}s` }}>
            {line}
          </p>
        ))}
      </div>

      {chapter.closing && (
        <p
          className="mt-10 font-script text-2xl gold-text ink-in"
          style={{ animationDelay: "1.5s" }}
        >
          {chapter.closing}
        </p>
      )}

      {chapter.transition && (
        <p
          className="mt-8 font-hand text-sm italic text-[color:var(--ink-soft)] ink-in"
          style={{ animationDelay: "1.7s" }}
        >
          {chapter.transition}
        </p>
      )}

      <button
        type="button"
        onClick={onContinue}
        className="btn-ink mt-12 self-center ink-in"
        style={{ animationDelay: "1.9s" }}
      >
        {isLast ? "Close the Journal" : "Turn the Page"}
      </button>
    </div>
  );
}

function ClosingPage({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center text-center">
      <p
        className="font-display text-xs uppercase tracking-[0.5em] text-[color:var(--ink-soft)] ink-in"
      >
        Chapter 35
      </p>
      <h1
        className="mt-6 font-script text-5xl gold-text ink-in sm:text-6xl"
        style={{ animationDelay: "0.3s" }}
      >
        A New Chapter Awaits
      </h1>

      <div
        className="mt-12 space-y-5 font-display text-lg italic leading-relaxed text-[color:var(--ink)] ink-in"
        style={{ animationDelay: "0.6s" }}
      >
        <p>The Lord has been faithful in every chapter already written.</p>
        <p>He will be faithful in every chapter still to come.</p>
      </div>

      <p
        className="mt-12 font-script text-2xl gold-text ink-in"
        style={{ animationDelay: "1s" }}
      >
        Every Chapter Tells the Story of God's Faithfulness.
      </p>

      <button
        type="button"
        onClick={onContinue}
        className="btn-ink mt-14 ink-in"
        style={{ animationDelay: "1.3s" }}
      >
        Continue the Journey
      </button>
    </div>
  );
}

function ChapterRibbons({
  current,
  onGoTo,
}: {
  current: PageId;
  onGoTo: (id: PageId) => void;
}) {
  const items = useMemo(
    () => [
      { id: "dedication" as PageId, label: "Dedication" },
      ...chapters.map((c) => ({ id: c.id as PageId, label: c.title })),
      { id: "closing" as PageId, label: "Chapter 35" },
    ],
    [],
  );
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mx-auto block font-display text-xs italic tracking-[0.3em] uppercase text-[oklch(0.78_0.08_78_/_0.7)] transition hover:text-[oklch(0.85_0.13_82)]"
      >
        {open ? "close chapters" : "table of chapters"}
      </button>
      {open && (
        <ul className="mx-auto mt-6 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-2 text-left sm:grid-cols-2">
          {items.map((it, i) => {
            const active = it.id === current;
            return (
              <li key={it.id}>
                <button
                  type="button"
                  onClick={() => onGoTo(it.id)}
                  className={[
                    "group flex w-full items-baseline gap-3 border-b border-[oklch(0.5_0.06_40_/_0.2)] py-2 text-left font-display italic transition-colors",
                    active
                      ? "text-[oklch(0.85_0.13_82)]"
                      : "text-[oklch(0.78_0.06_78_/_0.65)] hover:text-[oklch(0.85_0.13_82)]",
                  ].join(" ")}
                >
                  <span className="w-6 text-right text-xs tracking-widest">
                    {String(i).padStart(2, "0")}
                  </span>
                  <span className="flex-1">{it.label}</span>
                  {active && <span className="text-[oklch(0.85_0.13_82)]">◆</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}