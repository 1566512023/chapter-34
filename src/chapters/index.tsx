import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { chapters, type Chapter, type ChapterItem } from "@/data/chapters";
import { ChapterFrame } from "@/components/chapter/ChapterFrame";
import { RevealModal } from "@/components/chapter/RevealModal";

import bgSunrise from "@/assets/bg-sunrise.jpg";
import bgPath from "@/assets/bg-path.jpg";
import bgGarden from "@/assets/bg-garden.jpg";
import bgSanctuary from "@/assets/bg-sanctuary.jpg";
import bgGallery from "@/assets/bg-gallery.jpg";
import bgOffice from "@/assets/bg-office.jpg";
import bgHome from "@/assets/bg-home.jpg";
import bgWritingRoom from "@/assets/bg-writingroom.jpg";
import bgNightSky from "@/assets/bg-nightsky.jpg";
import bgStudio from "@/assets/bg-studio.jpg";
import bgLibrary from "@/assets/bg-library.jpg";
import bgScripture from "@/assets/bg-scripture.jpg";
import bgPrayer from "@/assets/bg-prayer.jpg";
import bgCourtroom from "@/assets/bg-courtroom.jpg";
import bgLegacy from "@/assets/bg-legacy.jpg";
import bgNextChapter from "@/assets/bg-nextchapter.jpg";

/** Helper: next chapter id in the sequence */
function nextId(id: string): string | null {
  const i = chapters.findIndex((c) => c.id === id);
  return i >= 0 && i < chapters.length - 1 ? chapters[i + 1]!.id : null;
}

function useReveal() {
  const [item, setItem] = useState<ChapterItem | null>(null);
  return { item, open: setItem, close: () => setItem(null) };
}

/** Generic clickable "constellation" of cards — used by chapters that need a grid. */
function CardGrid({
  items,
  onOpen,
  cardClass,
  labelClass,
}: {
  items: ChapterItem[];
  onOpen: (i: ChapterItem) => void;
  cardClass?: string;
  labelClass?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, idx) => (
        <button
          key={it.id}
          type="button"
          onClick={() => onOpen(it)}
          style={{ animationDelay: `${idx * 80}ms` }}
          className={`ink-in group relative overflow-hidden rounded-sm border border-current/20 p-6 text-left backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-current ${cardClass ?? "bg-white/5"}`}
        >
          {it.subtitle && (
            <p className={`font-display text-[0.65rem] uppercase tracking-[0.4em] opacity-70 ${labelClass ?? ""}`}>
              {it.subtitle}
            </p>
          )}
          <h3 className={`mt-1 font-display text-xl italic ${labelClass ?? ""}`}>
            {it.title}
          </h3>
          <p className={`mt-3 font-display text-sm leading-relaxed opacity-80 ${labelClass ?? ""}`}>
            {(it.body || "").slice(0, 90)}
            {(it.body || "").length > 90 ? "…" : ""}
          </p>
          <span className={`mt-4 inline-block font-display text-xs italic opacity-70 ${labelClass ?? ""}`}>
            open ›
          </span>
        </button>
      ))}
    </div>
  );
}

/* ---------- 1. Before Time Began — sunrise ---------- */
function BeforeTime({ ch }: { ch: Chapter }) {
  const r = useReveal();
  return (
    <ChapterFrame
      number={ch.number}
      title={ch.title}
      theme={ch.theme}
      bg={bgSunrise}
      overlay="linear-gradient(to bottom, oklch(0.95 0.1 82 / 0.15), oklch(0.7 0.12 60 / 0.35))"
      textClass="text-[oklch(0.25_0.06_45)]"
      accentClass="text-[oklch(0.4_0.14_35)]"
      closing={ch.closing}
      next={nextId(ch.id)}
    >
      {ch.verse && (
        <p className="mx-auto mb-10 max-w-2xl text-center font-display italic text-[oklch(0.3_0.08_45)]">
          {ch.verse}
        </p>
      )}
      <CardGrid
        items={ch.items!}
        onOpen={r.open}
        cardClass="bg-[oklch(0.95_0.05_82_/_0.55)] border-[oklch(0.45_0.12_45_/_0.35)]"
        labelClass="text-[oklch(0.28_0.08_45)]"
      />
      <RevealModal item={r.item} onClose={r.close} accent="oklch(0.55 0.15 35)" />
    </ChapterFrame>
  );
}

/* ---------- 2. Thus Far — Ebenezer stones along a path ---------- */
function ThusFar({ ch }: { ch: Chapter }) {
  const r = useReveal();
  return (
    <ChapterFrame
      number={ch.number}
      title={ch.title}
      theme={ch.theme}
      bg={bgPath}
      overlay="linear-gradient(to bottom, oklch(0.15 0.05 45 / 0.4), oklch(0.1 0.04 45 / 0.7))"
      closing={ch.closing}
      next={nextId(ch.id)}
    >
      {ch.verse && (
        <p className="mx-auto mb-8 max-w-2xl text-center font-display italic text-[oklch(0.9_0.05_82)]">
          {ch.verse}
        </p>
      )}
      <ol className="mx-auto flex max-w-3xl flex-col items-stretch gap-6">
        {ch.items!.map((it, i) => (
          <li key={it.id} className="ink-in" style={{ animationDelay: `${i * 100}ms` }}>
            <button
              type="button"
              onClick={() => r.open(it)}
              className={`group flex w-full items-center gap-6 rounded-sm border border-[oklch(0.85_0.13_82_/_0.4)] bg-[oklch(0.1_0.04_45_/_0.55)] p-5 text-left backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[oklch(0.85_0.13_82)] ${i % 2 ? "sm:ml-24" : "sm:mr-24"}`}
            >
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[oklch(0.85_0.13_82_/_0.5)] font-display text-lg italic text-[oklch(0.85_0.13_82)] shadow-[0_0_30px_oklch(0.85_0.13_82_/_0.3)]"
                style={{ background: "radial-gradient(circle, oklch(0.4 0.06 45), oklch(0.2 0.04 40))" }}
              >
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="font-display text-xs uppercase tracking-[0.3em] text-[oklch(0.85_0.13_82)]">
                  {it.subtitle ?? "Ebenezer Stone"}
                </p>
                <h3 className="mt-1 font-display text-2xl italic text-[oklch(0.95_0.05_82)]">
                  {it.title}
                </h3>
              </div>
              <span className="font-display text-2xl text-[oklch(0.85_0.13_82_/_0.7)]">›</span>
            </button>
          </li>
        ))}
      </ol>
      <RevealModal item={r.item} onClose={r.close} />
    </ChapterFrame>
  );
}

/* ---------- 3. Garden — clickable flowers ---------- */
function Garden({ ch }: { ch: Chapter }) {
  const r = useReveal();
  const positions = [
    { top: "18%", left: "12%" }, { top: "55%", left: "22%" }, { top: "30%", left: "38%" },
    { top: "68%", left: "50%" }, { top: "22%", left: "68%" }, { top: "58%", left: "82%" },
  ];
  return (
    <ChapterFrame
      number={ch.number}
      title={ch.title}
      theme={ch.theme}
      bg={bgGarden}
      overlay="linear-gradient(to bottom, oklch(0.98 0.03 90 / 0.15), oklch(0.85 0.08 100 / 0.35))"
      textClass="text-[oklch(0.25_0.08_150)]"
      accentClass="text-[oklch(0.35_0.15_15)]"
      closing={ch.closing}
      next={nextId(ch.id)}
    >
      <div className="relative mx-auto h-[60vh] w-full max-w-4xl rounded-sm border border-[oklch(0.35_0.15_15_/_0.25)] bg-white/20 backdrop-blur-[2px]">
        {ch.items!.map((it, i) => {
          const pos = positions[i % positions.length]!;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => r.open(it)}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ top: pos.top, left: pos.left }}
              aria-label={it.title}
            >
              <span
                className="block h-10 w-10 rounded-full transition-transform group-hover:scale-125"
                style={{
                  background: "radial-gradient(circle at 30% 30%, oklch(0.85 0.18 15), oklch(0.55 0.22 15))",
                  boxShadow: "0 0 20px oklch(0.75 0.2 15 / 0.6), inset 0 -4px 8px oklch(0.35 0.15 15 / 0.4)",
                }}
              />
              <span className="mt-2 block whitespace-nowrap font-hand text-sm text-[oklch(0.2_0.1_150)] group-hover:text-[oklch(0.35_0.18_15)]">
                {it.title}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-6 text-center font-hand text-lg text-[oklch(0.3_0.1_150)]">
        Touch a bloom to unfold a memory.
      </p>
      <RevealModal item={r.item} onClose={r.close} accent="oklch(0.55 0.22 15)" />
    </ChapterFrame>
  );
}

/* ---------- 4. Foundation — four pillars ---------- */
function Foundation({ ch }: { ch: Chapter }) {
  const r = useReveal();
  return (
    <ChapterFrame
      number={ch.number}
      title={ch.title}
      theme={ch.theme}
      bg={bgSanctuary}
      overlay="linear-gradient(to bottom, oklch(0.2 0.05 60 / 0.5), oklch(0.1 0.04 40 / 0.6))"
      closing={ch.closing}
      next={nextId(ch.id)}
    >
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-4">
        {ch.items!.map((it, i) => (
          <button
            key={it.id}
            type="button"
            onClick={() => r.open(it)}
            style={{ animationDelay: `${i * 150}ms` }}
            className="ink-in group relative flex min-h-[50vh] flex-col items-center justify-end overflow-hidden rounded-t-full border-x-2 border-t-2 border-[oklch(0.85_0.13_82_/_0.4)] bg-gradient-to-b from-[oklch(0.85_0.1_82_/_0.15)] via-[oklch(0.5_0.08_45_/_0.2)] to-transparent p-6 text-center transition-all hover:border-[oklch(0.85_0.13_82)]"
          >
            <div className="absolute inset-x-4 top-4 h-6 rounded border border-[oklch(0.85_0.13_82_/_0.4)] bg-[oklch(0.35_0.08_45_/_0.4)]" />
            <h3 className="font-display text-3xl italic text-[oklch(0.9_0.1_82)]">
              {it.title}
            </h3>
            <p className="mt-2 font-display text-xs uppercase tracking-[0.3em] text-[oklch(0.85_0.13_82)]">
              {it.subtitle}
            </p>
            <span className="mt-4 font-display text-xs italic text-[oklch(0.9_0.05_82_/_0.7)]">
              enter ›
            </span>
          </button>
        ))}
      </div>
      <RevealModal item={r.item} onClose={r.close} />
    </ChapterFrame>
  );
}

/* ---------- 5. Woman — portrait gallery ---------- */
function Woman({ ch }: { ch: Chapter }) {
  const r = useReveal();
  return (
    <ChapterFrame
      number={ch.number}
      title={ch.title}
      theme={ch.theme}
      bg={bgGallery}
      overlay="linear-gradient(to bottom, oklch(0.15 0.08 20 / 0.5), oklch(0.1 0.05 20 / 0.75))"
      accentClass="text-[oklch(0.85_0.15_50)]"
      closing={ch.closing}
      next={nextId(ch.id)}
    >
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {ch.items!.map((it, i) => (
          <button
            key={it.id}
            type="button"
            onClick={() => r.open(it)}
            style={{ animationDelay: `${i * 90}ms` }}
            className="ink-in group relative flex aspect-[3/4] flex-col items-center justify-end rounded-sm border-4 border-[oklch(0.55_0.15_50)] bg-[linear-gradient(180deg,oklch(0.2_0.08_20)_0%,oklch(0.35_0.1_25)_60%,oklch(0.5_0.12_30)_100%)] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-2"
          >
            <div className="absolute inset-3 rounded-sm border border-[oklch(0.55_0.15_50_/_0.6)]" />
            <div className="mb-6 h-24 w-24 rounded-full bg-gradient-to-br from-[oklch(0.75_0.1_60)] to-[oklch(0.45_0.1_40)] shadow-inner" />
            <h3 className="relative font-display text-lg italic text-[oklch(0.95_0.05_82)]">
              {it.title}
            </h3>
          </button>
        ))}
      </div>
      <RevealModal item={r.item} onClose={r.close} accent="oklch(0.75 0.15 50)" />
    </ChapterFrame>
  );
}

/* ---------- 6. Purpose — law office rooms ---------- */
function Purpose({ ch }: { ch: Chapter }) {
  const r = useReveal();
  return (
    <ChapterFrame
      number={ch.number}
      title={ch.title}
      theme={ch.theme}
      bg={bgOffice}
      overlay="linear-gradient(to bottom, oklch(0.15 0.04 40 / 0.55), oklch(0.08 0.03 30 / 0.75))"
      closing={ch.closing}
      next={nextId(ch.id)}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ch.items!.map((it, i) => (
          <button
            key={it.id}
            type="button"
            onClick={() => r.open(it)}
            style={{ animationDelay: `${i * 80}ms` }}
            className="ink-in group relative flex flex-col rounded-sm border border-[oklch(0.7_0.1_60_/_0.4)] bg-[oklch(0.15_0.04_40_/_0.7)] p-5 text-left backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[oklch(0.85_0.13_78)]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-[oklch(0.75_0.13_78_/_0.6)] font-display text-xs italic text-[oklch(0.85_0.13_78)]">
                §
              </span>
              {it.subtitle && (
                <p className="font-display text-xs uppercase tracking-[0.3em] text-[oklch(0.85_0.13_78)]">
                  {it.subtitle}
                </p>
              )}
            </div>
            <h3 className="mt-3 font-display text-xl italic text-[oklch(0.95_0.05_82)]">
              {it.title}
            </h3>
            <p className="mt-2 font-display text-sm leading-relaxed text-[oklch(0.85_0.05_82_/_0.85)]">
              {(it.body ?? "").slice(0, 100)}
            </p>
          </button>
        ))}
      </div>
      <RevealModal item={r.item} onClose={r.close} />
    </ChapterFrame>
  );
}

/* ---------- 7. Little Hands — family home ---------- */
function LittleHands({ ch }: { ch: Chapter }) {
  const r = useReveal();
  return (
    <ChapterFrame
      number={ch.number}
      title={ch.title}
      theme={ch.theme}
      bg={bgHome}
      overlay="linear-gradient(to bottom, oklch(0.98 0.04 80 / 0.15), oklch(0.6 0.08 40 / 0.5))"
      textClass="text-[oklch(0.25_0.06_45)]"
      accentClass="text-[oklch(0.4_0.15_25)]"
      closing={ch.closing}
      next={nextId(ch.id)}
    >
      <CardGrid
        items={ch.items!}
        onOpen={r.open}
        cardClass="bg-[oklch(0.98_0.04_80_/_0.7)] border-[oklch(0.4_0.15_25_/_0.3)]"
        labelClass="text-[oklch(0.28_0.08_45)]"
      />
      <RevealModal item={r.item} onClose={r.close} accent="oklch(0.55 0.2 25)" />
    </ChapterFrame>
  );
}

/* ---------- 8. Letters — envelope drawer ---------- */
function Letters({ ch }: { ch: Chapter }) {
  const r = useReveal();
  return (
    <ChapterFrame
      number={ch.number}
      title={ch.title}
      theme={ch.theme}
      bg={bgWritingRoom}
      overlay="linear-gradient(to bottom, oklch(0.1 0.03 40 / 0.65), oklch(0.05 0.02 30 / 0.8))"
      closing={ch.closing}
      next={nextId(ch.id)}
    >
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
        {ch.items!.map((it, i) => (
          <button
            key={it.id}
            type="button"
            onClick={() => r.open(it)}
            style={{ animationDelay: `${i * 100}ms` }}
            className="ink-in group relative flex aspect-[5/3] flex-col items-center justify-center rounded-sm border border-[oklch(0.7_0.05_82_/_0.35)] bg-gradient-to-br from-[oklch(0.85_0.06_82)] via-[oklch(0.75_0.05_78)] to-[oklch(0.6_0.06_60)] p-4 text-center shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-1"
          >
            {/* wax seal */}
            <span
              className="absolute -top-3 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full shadow"
              style={{ background: "radial-gradient(circle, oklch(0.55 0.2 25), oklch(0.3 0.15 25))" }}
            />
            <h3 className="font-display text-xl italic text-[oklch(0.2_0.05_40)]">
              {it.title}
            </h3>
            <p className="mt-2 font-hand text-xs text-[oklch(0.3_0.05_45)]">unseal to open</p>
          </button>
        ))}
      </div>
      <RevealModal item={r.item} onClose={r.close} accent="oklch(0.55 0.2 25)" />
    </ChapterFrame>
  );
}

/* ---------- 9. Faithfulness — clickable stars ---------- */
function Faithfulness({ ch }: { ch: Chapter }) {
  const r = useReveal();
  const starPositions = [
    { top: "12%", left: "18%" }, { top: "22%", left: "42%" }, { top: "8%", left: "68%" },
    { top: "35%", left: "78%" }, { top: "45%", left: "20%" }, { top: "55%", left: "55%" },
    { top: "72%", left: "35%" }, { top: "80%", left: "72%" }, { top: "30%", left: "55%" },
    { top: "62%", left: "12%" },
  ];
  return (
    <ChapterFrame
      number={ch.number}
      title={ch.title}
      theme={ch.theme}
      bg={bgNightSky}
      overlay="linear-gradient(to bottom, oklch(0.05 0.03 260 / 0.4), oklch(0.03 0.02 260 / 0.7))"
      closing={ch.closing}
      next={nextId(ch.id)}
    >
      <div className="relative mx-auto h-[65vh] w-full max-w-5xl">
        {ch.items!.map((it, i) => {
          const pos = starPositions[i % starPositions.length]!;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => r.open(it)}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ top: pos.top, left: pos.left }}
              aria-label={it.title}
            >
              <span
                className="candle-glow block h-3 w-3 rounded-full transition-all group-hover:h-5 group-hover:w-5"
                style={{
                  background: "oklch(1 0.05 82)",
                  boxShadow:
                    "0 0 12px oklch(1 0.1 82), 0 0 30px oklch(0.9 0.15 78 / 0.7), 0 0 60px oklch(0.85 0.15 78 / 0.4)",
                }}
              />
              <span className="pointer-events-none mt-2 block whitespace-nowrap font-hand text-xs text-[oklch(0.9_0.1_82_/_0)] transition-opacity group-hover:text-[oklch(0.95_0.12_82)]">
                {it.title}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-center font-hand text-lg text-[oklch(0.85_0.08_82_/_0.7)]">
        Touch a star. Read a testimony.
      </p>
      <RevealModal item={r.item} onClose={r.close} />
    </ChapterFrame>
  );
}

/* ---------- 10. Dreams — vision board ---------- */
function Dreams({ ch }: { ch: Chapter }) {
  const r = useReveal();
  return (
    <ChapterFrame
      number={ch.number}
      title={ch.title}
      theme={ch.theme}
      bg={bgStudio}
      overlay="linear-gradient(to bottom, oklch(0.9 0.03 80 / 0.3), oklch(0.5 0.06 60 / 0.55))"
      textClass="text-[oklch(0.2_0.05_40)]"
      accentClass="text-[oklch(0.4_0.15_35)]"
      closing={ch.closing}
      next={nextId(ch.id)}
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {ch.items!.map((it, i) => {
          const rot = (i % 5) - 2;
          const fulfilled = it.subtitle?.toLowerCase().includes("fulfilled");
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => r.open(it)}
              style={{ transform: `rotate(${rot}deg)`, animationDelay: `${i * 80}ms` }}
              className={`ink-in group relative flex aspect-square flex-col items-center justify-center rounded-sm border border-[oklch(0.35_0.08_45_/_0.3)] p-4 text-center shadow-md transition-transform hover:rotate-0 hover:scale-105 ${fulfilled ? "bg-[oklch(0.98_0.08_82)]" : "bg-[oklch(0.95_0.03_80_/_0.9)]"}`}
            >
              {/* pin */}
              <span className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[oklch(0.4_0.15_25)] shadow" />
              {fulfilled && (
                <span className="absolute inset-0 rounded-sm shadow-[inset_0_0_30px_oklch(0.85_0.15_78_/_0.5)]" />
              )}
              <h3 className="relative font-display text-base italic text-[oklch(0.2_0.05_40)]">
                {it.title}
              </h3>
              <p className="relative mt-2 font-display text-[0.6rem] uppercase tracking-[0.3em] text-[oklch(0.4_0.15_35)]">
                {it.subtitle}
              </p>
            </button>
          );
        })}
      </div>
      <RevealModal item={r.item} onClose={r.close} accent="oklch(0.55 0.18 35)" />
    </ChapterFrame>
  );
}

/* ---------- 11. Memories — library shelves by year ---------- */
function Memories({ ch }: { ch: Chapter }) {
  const r = useReveal();
  return (
    <ChapterFrame
      number={ch.number}
      title={ch.title}
      theme={ch.theme}
      bg={bgLibrary}
      overlay="linear-gradient(to bottom, oklch(0.1 0.03 40 / 0.55), oklch(0.05 0.02 30 / 0.75))"
      closing={ch.closing}
      next={nextId(ch.id)}
    >
      <div className="mx-auto max-w-4xl space-y-8">
        {[ch.items!.slice(0, 4), ch.items!.slice(4)].map((row, ri) => (
          <div key={ri} className="relative">
            <div className="flex items-end justify-center gap-3">
              {row.map((it, i) => {
                const colors = ["oklch(0.35 0.1 25)", "oklch(0.3 0.08 45)", "oklch(0.4 0.1 60)", "oklch(0.25 0.06 260)"];
                const bg = colors[i % colors.length];
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => r.open(it)}
                    style={{ background: bg, animationDelay: `${(ri * 4 + i) * 80}ms` }}
                    className="ink-in group relative flex h-52 w-16 flex-col items-center justify-between rounded-sm border border-black/40 py-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.4)] transition-transform hover:-translate-y-2"
                  >
                    <span className="font-display text-[0.6rem] uppercase tracking-widest text-[oklch(0.85_0.13_82)]">
                      Album
                    </span>
                    <span
                      className="font-display text-lg italic text-[oklch(0.9_0.08_82)]"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      {it.title}
                    </span>
                    <span className="font-display text-[0.6rem] text-[oklch(0.85_0.13_82_/_0.7)]">✦</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-1 h-2 rounded-sm bg-gradient-to-b from-[oklch(0.35_0.07_40)] to-[oklch(0.2_0.05_40)] shadow-md" />
          </div>
        ))}
      </div>
      <RevealModal item={r.item} onClose={r.close} />
    </ChapterFrame>
  );
}

/* ---------- 12. Love Letter — scripture topics ---------- */
function LoveLetter({ ch }: { ch: Chapter }) {
  const r = useReveal();
  return (
    <ChapterFrame
      number={ch.number}
      title={ch.title}
      theme={ch.theme}
      bg={bgScripture}
      overlay="linear-gradient(to bottom, oklch(0.15 0.05 60 / 0.3), oklch(0.08 0.03 40 / 0.65))"
      closing={ch.closing}
      next={nextId(ch.id)}
    >
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {ch.items!.map((it, i) => (
          <button
            key={it.id}
            type="button"
            onClick={() => r.open(it)}
            style={{ animationDelay: `${i * 100}ms` }}
            className="ink-in group relative flex aspect-[4/5] flex-col items-center justify-center rounded-sm border border-[oklch(0.85_0.13_82_/_0.4)] bg-[oklch(0.95_0.05_82_/_0.9)] p-4 text-center shadow-lg transition-transform hover:-translate-y-2"
          >
            <h3 className="font-script text-2xl text-[oklch(0.35_0.08_45)]">
              {it.title}
            </h3>
            <div className="my-3 h-px w-8 bg-[oklch(0.55_0.15_45)]" />
            <p className="font-display text-xs italic text-[oklch(0.35_0.08_45)]">
              {it.scripture}
            </p>
          </button>
        ))}
      </div>
      <RevealModal item={r.item} onClose={r.close} />
    </ChapterFrame>
  );
}

/* ---------- 13. Prayer Room ---------- */
function Prayer({ ch }: { ch: Chapter }) {
  const r = useReveal();
  return (
    <ChapterFrame
      number={ch.number}
      title={ch.title}
      theme={ch.theme}
      bg={bgPrayer}
      overlay="linear-gradient(to bottom, oklch(0.05 0.02 40 / 0.6), oklch(0.03 0.01 30 / 0.85))"
      closing={ch.closing}
      next={nextId(ch.id)}
    >
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-3">
        {ch.items!.map((it, i) => (
          <button
            key={it.id}
            type="button"
            onClick={() => r.open(it)}
            style={{ animationDelay: `${i * 100}ms` }}
            className="ink-in group relative flex flex-col items-center gap-3 rounded-sm border border-[oklch(0.55_0.15_60_/_0.3)] bg-[oklch(0.1_0.03_40_/_0.4)] p-6 text-center backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[oklch(0.75_0.15_60)]"
          >
            <span
              className="candle-glow block h-8 w-2 rounded-full"
              style={{ background: "linear-gradient(to top, oklch(0.85 0.15 60), oklch(0.98 0.1 82))",
                boxShadow: "0 0 20px oklch(0.85 0.15 60 / 0.8)" }}
            />
            <h3 className="font-display text-lg italic text-[oklch(0.95_0.08_82)]">
              {it.title}
            </h3>
          </button>
        ))}
      </div>
      <RevealModal item={r.item} onClose={r.close} />
    </ChapterFrame>
  );
}

/* ---------- 14. Verdict — courtroom case file ---------- */
function Verdict({ ch }: { ch: Chapter }) {
  const r = useReveal();
  return (
    <ChapterFrame
      number={ch.number}
      title={ch.title}
      theme={ch.theme}
      bg={bgCourtroom}
      overlay="linear-gradient(to bottom, oklch(0.08 0.03 40 / 0.6), oklch(0.05 0.02 30 / 0.8))"
      closing={ch.closing}
      next={nextId(ch.id)}
    >
      <div className="mx-auto max-w-2xl">
        <div className="paper rounded-sm p-8 text-center shadow-2xl">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-[color:var(--ink-soft)]">
            Case File
          </p>
          <h2 className="mt-2 font-display text-4xl italic text-[color:var(--ink)]">
            A Life Redeemed
          </h2>
          <div className="mt-4 h-px w-24 bg-[oklch(0.55_0.15_25)] mx-auto" />
          <dl className="mt-6 grid grid-cols-2 gap-2 text-left font-display text-sm text-[color:var(--ink)]">
            <dt className="italic text-[color:var(--ink-soft)]">Judge</dt><dd>The Lord</dd>
            <dt className="italic text-[color:var(--ink-soft)]">Advocate</dt><dd>Jesus Christ</dd>
            <dt className="italic text-[color:var(--ink-soft)]">Verdict</dt><dd>Read below</dd>
          </dl>
          <p className="mt-6 font-display text-xs uppercase tracking-[0.3em] text-[color:var(--ink-soft)]">
            Touch each stamp
          </p>
          <div className="mt-6 grid grid-cols-5 gap-3">
            {ch.items!.map((it, i) => (
              <button
                key={it.id}
                type="button"
                onClick={() => r.open(it)}
                style={{ animationDelay: `${i * 140}ms` }}
                className="ink-in group flex aspect-square flex-col items-center justify-center rounded-full border-2 border-[oklch(0.5_0.2_25)] font-display text-xs uppercase tracking-widest text-[oklch(0.5_0.2_25)] transition-transform hover:scale-110"
                style-x=""
              >
                {it.title}
              </button>
            ))}
          </div>
        </div>
      </div>
      <RevealModal item={r.item} onClose={r.close} accent="oklch(0.55 0.2 25)" />
    </ChapterFrame>
  );
}

/* ---------- 15. Legacy — family tree + time capsule ---------- */
function Legacy({ ch }: { ch: Chapter }) {
  const r = useReveal();
  return (
    <ChapterFrame
      number={ch.number}
      title={ch.title}
      theme={ch.theme}
      bg={bgLegacy}
      overlay="linear-gradient(to bottom, oklch(0.98 0.03 80 / 0.15), oklch(0.5 0.06 40 / 0.45))"
      textClass="text-[oklch(0.2_0.05_40)]"
      accentClass="text-[oklch(0.4_0.15_35)]"
      closing={ch.closing}
      next={nextId(ch.id)}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-2xl italic text-[oklch(0.25_0.08_45)]">Family Tree</h2>
          <p className="mt-1 font-hand text-sm text-[oklch(0.35_0.1_45)]">Roots and branches</p>
          <div className="mt-4 grid grid-cols-1 gap-3">
            {ch.items!.slice(0, 4).map((it, i) => (
              <button
                key={it.id}
                type="button"
                onClick={() => r.open(it)}
                style={{ animationDelay: `${i * 100}ms` }}
                className="ink-in flex items-center justify-between rounded-sm border border-[oklch(0.35_0.08_45_/_0.35)] bg-[oklch(0.98_0.04_80_/_0.7)] px-5 py-3 text-left transition-all hover:-translate-x-1 hover:border-[oklch(0.4_0.15_35)]"
              >
                <span className="font-display italic text-[oklch(0.25_0.08_45)]">{it.title}</span>
                <span className="text-[oklch(0.4_0.15_35)]">›</span>
              </button>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-display text-2xl italic text-[oklch(0.25_0.08_45)]">Time Capsule</h2>
          <p className="mt-1 font-hand text-sm text-[oklch(0.35_0.1_45)]">Letters locked for later</p>
          <div className="mt-4 grid grid-cols-1 gap-3">
            {ch.items!.slice(4).map((it, i) => (
              <button
                key={it.id}
                type="button"
                onClick={() => r.open(it)}
                style={{ animationDelay: `${(i + 4) * 100}ms` }}
                className="ink-in group flex items-center gap-4 rounded-sm border border-[oklch(0.35_0.08_45_/_0.4)] bg-[linear-gradient(90deg,oklch(0.35_0.08_45),oklch(0.5_0.1_40))] px-5 py-3 text-left shadow transition-all hover:-translate-x-1"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[oklch(0.85_0.13_82_/_0.6)] font-display text-[oklch(0.9_0.1_82)]">
                  🔒
                </span>
                <span className="font-display italic text-[oklch(0.95_0.05_82)]">{it.title}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
      <RevealModal item={r.item} onClose={r.close} accent="oklch(0.55 0.18 35)" />
    </ChapterFrame>
  );
}

/* ---------- 16. Future — blank journal ---------- */
function Future({ ch }: { ch: Chapter }) {
  return (
    <ChapterFrame
      number={ch.number}
      title={ch.title}
      theme={ch.theme}
      bg={bgNextChapter}
      overlay="linear-gradient(to bottom, oklch(0.1 0.03 40 / 0.5), oklch(0.05 0.02 30 / 0.7))"
      closing={ch.closing}
      next={null}
    >
      <div className="mx-auto max-w-xl text-center">
        <p className="font-display text-xs uppercase tracking-[0.5em] text-[oklch(0.85_0.13_82)]">
          Chapter 35
        </p>
        <h2 className="mt-6 font-script text-5xl gold-text sm:text-6xl">
          Blank Pages
        </h2>
        <p className="mt-8 font-display text-lg italic text-[oklch(0.95_0.05_82)]">
          The Lord has been faithful in every chapter already written.
        </p>
        <p className="mt-2 font-display text-lg italic text-[oklch(0.95_0.05_82)]">
          He will be faithful in every chapter still to come.
        </p>
        <div className="mt-12 flex flex-col items-center gap-4">
          <Link
            to="/journal"
            className="inline-flex items-center gap-3 border border-[oklch(0.85_0.13_82)] px-8 py-4 font-display italic tracking-widest text-[oklch(0.85_0.13_82)] transition-all hover:bg-[oklch(0.85_0.13_82_/_0.15)]"
          >
            Continue the Journey
          </Link>
          <Link
            to="/"
            className="font-display text-xs italic tracking-[0.3em] uppercase text-[oklch(0.85_0.08_82_/_0.6)] hover:text-[oklch(0.85_0.13_82)]"
          >
            close the journal
          </Link>
        </div>
      </div>
    </ChapterFrame>
  );
}

// ---------- Registry ----------

type ChapterComponent = (props: { ch: Chapter }) => JSX.Element;

export const chapterComponents: Record<string, ChapterComponent> = {
  "before-time": BeforeTime,
  "thus-far": ThusFar,
  "garden": Garden,
  "foundation": Foundation,
  "woman": Woman,
  "purpose": Purpose,
  "little-hands": LittleHands,
  "letters": Letters,
  "faithfulness": Faithfulness,
  "dreams": Dreams,
  "memories": Memories,
  "love-letter": LoveLetter,
  "prayer": Prayer,
  "verdict": Verdict,
  "legacy": Legacy,
  "future": Future,
};