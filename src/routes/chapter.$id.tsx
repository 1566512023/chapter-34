import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { chapters } from "@/data/chapters";
import { writeBookmark } from "@/lib/bookmark";
import { chapterComponents } from "@/chapters";
import { SoundscapePlayer } from "@/components/SoundscapePlayer";

export const Route = createFileRoute("/chapter/$id")({
  loader: ({ params }) => {
    const chapter = chapters.find((c) => c.id === params.id);
    if (!chapter) throw notFound();
    return { chapter };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.chapter.title} — Chapter 34` },
          {
            name: "description",
            content:
              loaderData.chapter.theme ??
              "A chapter in a living journal of God's faithfulness.",
          },
        ]
      : [{ title: "Chapter not found" }, { name: "robots", content: "noindex" }],
  }),
  component: ChapterPage,
  notFoundComponent: ChapterMissing,
  errorComponent: ChapterError,
});

function ChapterPage() {
  const { chapter } = Route.useLoaderData();
  useEffect(() => writeBookmark(chapter.id), [chapter.id]);
  const Component = chapterComponents[chapter.id];
  if (!Component) return <ChapterMissing />;
  return (
    <>
      <Component ch={chapter} />
      <SoundscapePlayer chapterId={chapter.id} />
    </>
  );
}

function ChapterMissing() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(0.1_0.03_40)] px-6 text-center">
      <div>
        <p className="font-script text-4xl gold-text">This page waits to be written.</p>
        <Link
          to="/journal"
          className="mt-8 inline-block font-display text-sm italic uppercase tracking-[0.3em] text-[oklch(0.85_0.13_82)]"
        >
          ‹ return to the journal
        </Link>
      </div>
    </div>
  );
}

function ChapterError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(0.1_0.03_40)] px-6 text-center">
      <div>
        <p className="font-display text-2xl italic text-[oklch(0.95_0.05_82)]">
          The page tore softly at its corner.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 border border-[oklch(0.85_0.13_82)] px-6 py-2 font-display italic text-[oklch(0.85_0.13_82)] hover:bg-[oklch(0.85_0.13_82_/_0.15)]"
        >
          try again
        </button>
      </div>
    </div>
  );
}