import { createFileRoute, Link } from "@tanstack/react-router";
import { chapters, dedication } from "@/data/chapters";
import { readBookmark } from "@/lib/bookmark";
import { MAIN_OPENING_IMAGE } from "@/data/chapter-images";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "The Journal — Chapter 34" },
      {
        name: "description",
        content:
          "A living journal of God's faithfulness — every chapter a world of its own.",
      },
    ],
  }),
  component: JournalPage,
});

function JournalPage() {
  const [bookmark, setBookmark] = useState<string | null>(null);
  useEffect(() => setBookmark(readBookmark()), []);

  return (
    <div
      className="relative min-h-screen w-full px-6 py-16 sm:px-10"
      style={{
        background:
          "radial-gradient(ellipse at top, oklch(0.97 0.03 80), oklch(0.9 0.05 20) 70%)",
      }}
    >
      <Link
        to="/"
        className="absolute left-6 top-6 font-display text-xs italic uppercase tracking-[0.3em] text-[oklch(0.5_0.08_25_/_0.75)] hover:text-[oklch(0.4_0.1_25)]"
      >
        ‹ close the journal
      </Link>

      <div className="mx-auto max-w-5xl">
        <section className="paper mx-auto mb-16 max-w-2xl rounded-sm px-10 py-12 shadow-2xl page-in">
          <figure className="mx-auto mb-8 w-48 overflow-hidden rounded-sm border border-[oklch(0.7_0.09_60_/_0.5)] shadow-lg">
            <img
              src={MAIN_OPENING_IMAGE.url}
              alt={MAIN_OPENING_IMAGE.alt}
              className="max-h-72 w-full object-contain"
            />
          </figure>
          <p className="text-center font-script text-3xl text-[oklch(0.4_0.14_35)]">
            {dedication.greeting}
          </p>
          <div className="mx-auto mt-4 h-px w-16 bg-[oklch(0.55_0.15_45)]" />
          <div className="mt-6 space-y-4 font-display text-[color:var(--ink)]">
            {dedication.paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed">{p}</p>
            ))}
          </div>
          <p className="mt-8 text-center font-script text-2xl gold-text">
            {dedication.motto}
          </p>
          <p className="mt-6 whitespace-pre-line text-right font-hand text-[color:var(--ink-soft)]">
            {dedication.signature}
          </p>
        </section>

        <header className="mb-12 text-center">
          <p className="font-display text-xs uppercase tracking-[0.5em] text-[oklch(0.55_0.1_25)]">
            Table of Contents
          </p>
          <h1 className="mt-4 font-display text-4xl italic text-[oklch(0.35_0.08_25)] sm:text-5xl">
            Chapter 34
          </h1>
          <p className="mt-3 font-hand text-lg text-[oklch(0.45_0.08_25)]">
            Every chapter is a world of its own. Step inside.
          </p>
          {bookmark && (
            <p className="mt-6 font-display text-sm italic text-[oklch(0.55_0.1_25)]">
              Bookmark saved at{" "}
              <Link
                to="/chapter/$id"
                params={{ id: bookmark }}
                className="underline decoration-[oklch(0.7_0.11_60_/_0.6)] underline-offset-4"
              >
                {chapters.find((c) => c.id === bookmark)?.title ?? "your last page"}
              </Link>
            </p>
          )}
        </header>

        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {chapters.map((c, i) => (
            <li key={c.id}>
              <Link
                to="/chapter/$id"
                params={{ id: c.id }}
                className="ink-in group flex items-baseline gap-4 border-b border-[oklch(0.7_0.09_60_/_0.35)] py-4 transition-all hover:border-[oklch(0.6_0.12_25)]"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="font-display text-xs uppercase tracking-[0.3em] text-[oklch(0.55_0.1_25_/_0.85)]">
                  {c.number}
                </span>
                <span className="flex-1 font-display text-xl italic text-[oklch(0.35_0.08_25)] group-hover:text-[oklch(0.5_0.12_25)]">
                  {c.title}
                </span>
                <span className="font-display text-[oklch(0.6_0.1_60)] group-hover:text-[oklch(0.5_0.12_25)]">
                  ›
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}