import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface ChapterFrameProps {
  number: string;
  title: string;
  theme?: string;
  bg: string;
  overlay?: string;
  textClass?: string;
  accentClass?: string;
  children: ReactNode;
  closing?: string;
  next?: string | null;
}

export function ChapterFrame({
  number,
  title,
  theme,
  bg,
  overlay = "linear-gradient(to bottom, oklch(0.08 0.02 40 / 0.55), oklch(0.05 0.01 40 / 0.75))",
  textClass = "text-[oklch(0.95_0.04_82)]",
  accentClass = "text-[oklch(0.85_0.13_82)]",
  children,
  closing,
  next,
}: ChapterFrameProps) {
  return (
    <div className="chapter-in relative min-h-screen w-full overflow-hidden">
      {/* background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="pointer-events-none absolute inset-0" style={{ background: overlay }} />

      {/* Return ribbon (top-left) */}
      <Link
        to="/journal"
        className={`absolute left-4 top-4 z-30 flex items-center gap-2 font-display text-xs italic tracking-[0.25em] uppercase transition-opacity hover:opacity-100 ${textClass} opacity-70 sm:left-6 sm:top-6`}
      >
        <span>‹</span>
        <span>return to journal</span>
      </Link>

      {/* Silk bookmark (top-right) */}
      <div className="pointer-events-none absolute right-8 top-0 z-20 hidden sm:block">
        <div
          className="ribbon-sway h-40 w-4"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.35 0.13 25), oklch(0.5 0.16 25), oklch(0.3 0.12 25))",
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 88%, 0 100%)",
            boxShadow: "0 6px 10px rgba(0,0,0,0.4)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-20 sm:px-10 sm:py-24">
        <header className="text-center">
          <p className={`font-display text-xs uppercase tracking-[0.5em] opacity-80 ${accentClass}`}>
            {number}
          </p>
          <h1 className={`mt-4 font-display text-4xl italic sm:text-6xl ${textClass}`}>
            {title}
          </h1>
          {theme && (
            <p className={`mx-auto mt-6 max-w-2xl font-hand text-lg opacity-90 ${textClass}`}>
              {theme}
            </p>
          )}
        </header>

        <div className="mt-16 flex-1">{children}</div>

        {closing && (
          <p className={`mt-16 text-center font-script text-3xl sm:text-4xl ${accentClass}`}>
            {closing}
          </p>
        )}

        {next && (
          <div className="mt-12 flex justify-center">
            <Link
              to="/chapter/$id"
              params={{ id: next }}
              className={`inline-flex items-center gap-3 border border-current px-6 py-3 font-display italic tracking-widest transition-all hover:bg-[oklch(0.85_0.13_82_/_0.15)] ${accentClass}`}
            >
              turn the page
              <span>›</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}