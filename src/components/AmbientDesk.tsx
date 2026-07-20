import { useMemo } from "react";

/** Floating dust particles catching the morning light. Purely decorative. */
export function Dust({ count = 30 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        size: 1 + Math.random() * 3,
        duration: 18 + Math.random() * 22,
        delay: -Math.random() * 30,
        key: i,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.key}
          className="dust absolute rounded-full bg-[oklch(0.92_0.08_82_/_0.55)] blur-[1px]"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            bottom: "-20px",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Warm vignette + morning-light wash overlaid on the desk photograph. */
export function DeskAtmosphere() {
  return (
    <>
      {/* Sunlight from left */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 8% 20%, oklch(0.95 0.12 82 / 0.35), transparent 60%)",
        }}
      />
      {/* Deep vignette to focus attention on the journal */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 55% at 50% 60%, transparent 30%, oklch(0.05 0.02 40 / 0.6) 100%)",
        }}
      />
    </>
  );
}