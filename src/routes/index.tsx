import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import deskScene from "@/assets/desk-scene.jpg";
import journalCover from "@/assets/journal-cover.jpg";
import { Dust, DeskAtmosphere } from "@/components/AmbientDesk";
import { readBookmark } from "@/lib/bookmark";
import { chapters } from "@/data/chapters";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [opening, setOpening] = useState(false);
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    setReturning(!!readBookmark());
  }, []);

  const open = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => {
      navigate({ to: "/journal", search: { p: "dedication" } as never });
    }, 1600);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden" style={{ background: "radial-gradient(ellipse at center, oklch(0.94 0.03 30), oklch(0.85 0.06 20))" }}>
      {/* Desk photograph */}
      <img
        src={deskScene}
        alt="A quiet morning study with a leather journal resting on an antique writing desk"
        className="absolute inset-0 h-full w-full object-cover"
        width={1920}
        height={1280}
      />
      <DeskAtmosphere />
      <Dust count={40} />

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
          style={{ filter: hover ? "drop-shadow(0 40px 60px rgba(0,0,0,0.7))" : "drop-shadow(0 25px 40px rgba(0,0,0,0.55))" }}
        >
          <div className="relative">
            <img
              src={journalCover}
              alt=""
              width={340}
              height={470}
              className="h-[62vh] max-h-[560px] w-auto rounded-[4px]"
              style={{
                boxShadow:
                  "inset 0 0 40px rgba(0,0,0,0.6), 0 30px 60px rgba(0,0,0,0.55)",
              }}
            />

            {/* Gold-embossed title over the cover */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <p
                className="font-script text-[2.4rem] leading-none tracking-wide"
                style={{
                  color: "oklch(0.78 0.13 82)",
                  textShadow:
                    "0 1px 0 rgba(0,0,0,0.5), 0 0 18px oklch(0.72 0.15 78 / 0.5)",
                  transition: "text-shadow 800ms ease",
                  filter: hover ? "brightness(1.2)" : "brightness(1)",
                }}
              >
                Phindile
              </p>
              <p
                className="mt-6 font-display text-sm tracking-[0.35em] uppercase"
                style={{ color: "oklch(0.78 0.13 82)", textShadow: "0 1px 0 rgba(0,0,0,0.5)" }}
              >
                Chapter 34
              </p>
              <div className="mt-4 h-px w-16 bg-[oklch(0.72_0.13_78_/_0.6)]" />
              <p
                className="mt-4 max-w-[14rem] font-display text-[0.7rem] italic leading-relaxed tracking-widest"
                style={{ color: "oklch(0.78 0.13 82 / 0.9)" }}
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
                  background:
                    "linear-gradient(90deg, oklch(0.35 0.13 25), oklch(0.45 0.16 25), oklch(0.3 0.12 25))",
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 88%, 0 100%)",
                  boxShadow: "0 6px 10px rgba(0,0,0,0.4)",
                }}
              />
            </div>

            {/* Golden glow on hover */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[4px] transition-opacity duration-700"
              style={{
                opacity: hover ? 1 : 0,
                background:
                  "radial-gradient(ellipse at center, oklch(0.85 0.13 82 / 0.25), transparent 65%)",
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
          style={{ color: "oklch(0.88 0.06 82)", textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}
        >
          {returning ? "Welcome back. Your story waits." : "Click to open your story."}
        </p>
      </div>

      {/* Opening flash — warm golden light */}
      <div
        className={[
          "pointer-events-none absolute inset-0 transition-opacity duration-[1400ms]",
          opening ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.95 0.14 82 / 0.95), oklch(0.85 0.12 82 / 0.6) 40%, oklch(0.1 0.02 40) 90%)",
        }}
      />

      {/* Subtle chapter marker in corner */}
      <div className="pointer-events-none absolute bottom-6 right-8 font-display text-xs tracking-[0.3em] uppercase text-[oklch(0.85_0.08_82_/_0.55)]">
        {chapters.length} chapters within
      </div>
    </main>
  );
}
