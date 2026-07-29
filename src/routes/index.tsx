import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import journalCoverPink from "@/assets/journal-cover-pink.jpg";
import journalCoverBlue from "@/assets/journal-cover-blue.jpg";
import { Dust, DeskAtmosphere } from "@/components/AmbientDesk";
import { readBookmark } from "@/lib/bookmark";
import { chapters } from "@/data/chapters";

export const Route = createFileRoute("/")({
  component: Index,
});

type CoverColor = "pink" | "blue";
const COVER_KEY = "phindile:cover-color";

function Index() {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [opening, setOpening] = useState(false);
  const [returning, setReturning] = useState(false);
  const [cover, setCover] = useState<CoverColor>("pink");

  useEffect(() => {
    setReturning(!!readBookmark());
    try {
      const stored = localStorage.getItem(COVER_KEY) as CoverColor | null;
      if (stored === "pink" || stored === "blue") setCover(stored);
    } catch {}
  }, []);

  const chooseCover = (c: CoverColor) => {
    setCover(c);
    try { localStorage.setItem(COVER_KEY, c); } catch {}
  };

  const open = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => {
      navigate({ to: "/journal", search: { p: "dedication" } as never });
    }, 1600);
  };

  const isPink = cover === "pink";
  const journalImg = isPink ? journalCoverPink : journalCoverBlue;
  const accent = isPink ? "oklch(0.55 0.14 20)" : "oklch(0.5 0.12 250)";
  const accentSoft = isPink ? "oklch(0.75 0.09 20)" : "oklch(0.72 0.08 250)";
  const embossedTitle = isPink ? "oklch(0.55 0.14 15)" : "oklch(0.45 0.1 250)";

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background: isPink
          ? "radial-gradient(ellipse at 30% 20%, oklch(0.98 0.03 340) 0%, oklch(0.94 0.05 20) 45%, oklch(0.88 0.06 300) 100%)"
          : "radial-gradient(ellipse at 30% 20%, oklch(0.98 0.02 220) 0%, oklch(0.94 0.04 240) 45%, oklch(0.9 0.05 300) 100%)",
      }}
    >
      <DeskAtmosphere />
      <Dust count={30} />

      {/* Cover-color picker */}
      <div className="absolute left-1/2 top-6 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white/60 px-4 py-2 backdrop-blur">
        <span className="font-display text-[0.6rem] uppercase tracking-[0.3em]" style={{ color: accent }}>
          Choose your journal
        </span>
        <button
          type="button"
          onClick={() => chooseCover("pink")}
          aria-label="Pink journal"
          className={`h-6 w-6 rounded-full border-2 transition ${isPink ? "border-[oklch(0.4_0.15_20)] scale-110" : "border-white/60"}`}
          style={{ background: "oklch(0.82 0.09 20)" }}
        />
        <button
          type="button"
          onClick={() => chooseCover("blue")}
          aria-label="Blue journal"
          className={`h-6 w-6 rounded-full border-2 transition ${!isPink ? "border-[oklch(0.35_0.12_250)] scale-110" : "border-white/60"}`}
          style={{ background: "oklch(0.82 0.07 240)" }}
        />
      </div>

      {/* Journal */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={open}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          aria-label="Open the journal"
          className={[
            "group relative outline-none",
            "transition-all duration-[1200ms] ease-out",
            opening
              ? "scale-[1.6] opacity-0"
              : hover
                ? "scale-105 -translate-y-2"
                : "journal-breathe",
          ].join(" ")}
          style={{ filter: hover ? "drop-shadow(0 30px 50px oklch(0.6 0.14 20 / 0.35))" : "drop-shadow(0 20px 35px oklch(0.6 0.14 20 / 0.25))" }}
        >
          <div className="relative">
            <img
              src={journalImg}
              alt=""
              width={340}
              height={470}
              className="h-[62vh] max-h-[560px] w-auto rounded-[4px]"
            />

            {/* Embossed title over the cover */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <p
                className="font-script text-[2.4rem] leading-none tracking-wide"
                style={{
                  color: embossedTitle,
                  textShadow: `0 1px 0 rgba(255,255,255,0.5), 0 0 18px ${accentSoft} / 0.5`,
                  transition: "text-shadow 800ms ease",
                  filter: hover ? "brightness(1.2)" : "brightness(1)",
                }}
              >
                Phindile
              </p>
              <p
                className="mt-6 font-display text-sm tracking-[0.35em] uppercase"
                style={{ color: embossedTitle }}
              >
                Chapter 34
              </p>
              <div className="mt-4 h-px w-16" style={{ background: accent }} />
              <p
                className="mt-4 max-w-[14rem] font-display text-[0.7rem] italic leading-relaxed tracking-widest"
                style={{ color: embossedTitle }}
              >
                Every Chapter Tells the Story of God's Faithfulness
              </p>
            </div>

            {/* Ribbon bookmark */}
            <div
              className={[
                "pointer-events-none absolute -top-2 right-10 w-4 origin-top",
                hover ? "ribbon-sway" : "",
              ].join(" ")}
            >
              <div
                className="h-40 w-4"
                style={{
                  background: isPink
                    ? "linear-gradient(90deg, oklch(0.7 0.15 20), oklch(0.8 0.16 15), oklch(0.65 0.14 20))"
                    : "linear-gradient(90deg, oklch(0.7 0.12 260), oklch(0.8 0.14 280), oklch(0.65 0.12 260))",
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 88%, 0 100%)",
                  boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
                }}
              />
            </div>

            {/* Soft glow on hover */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[4px] transition-opacity duration-700"
              style={{
                opacity: hover ? 1 : 0,
                background: `radial-gradient(ellipse at center, ${accentSoft} / 0.35, transparent 65%)`,
                mixBlendMode: "screen",
              }}
            />
          </div>
        </button>
      </div>

      {/* Handwritten invitation */}
      <div
        className={[
          "pointer-events-none absolute inset-x-0 bottom-[8vh] flex justify-center transition-all duration-700",
          hover && !opening ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        ].join(" ")}
      >
        <p
          className="font-hand text-lg"
          style={{ color: accent }}
        >
          {returning ? "Welcome back. Your story waits." : "Click to open your story."}
        </p>
      </div>

      {/* Opening flash — soft light */}
      <div
        className={[
          "pointer-events-none absolute inset-0 transition-opacity duration-[1400ms]",
          opening ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{
          background: isPink
            ? "radial-gradient(ellipse at center, oklch(0.99 0.05 340 / 0.95), oklch(0.9 0.08 320 / 0.7) 40%, oklch(0.98 0.03 340) 90%)"
            : "radial-gradient(ellipse at center, oklch(0.99 0.02 240 / 0.95), oklch(0.9 0.05 260 / 0.7) 40%, oklch(0.98 0.02 240) 90%)",
        }}
      />

      {/* Subtle chapter marker in corner */}
      <div className="pointer-events-none absolute bottom-6 right-8 font-display text-xs tracking-[0.3em] uppercase" style={{ color: accent }}>
        {chapters.length} chapters within
      </div>
    </main>
  );
}
