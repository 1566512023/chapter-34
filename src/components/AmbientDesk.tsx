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
          className="dust absolute rounded-full bg-[oklch(0.98_0.05_320_/_0.6)] blur-[1px]"
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

/** Bright, girly light-wash overlaid on the landing page. */
export function DeskAtmosphere() {
  return (
    <>
      {/* Soft pink glow */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse 70% 90% at 20% 15%, oklch(0.98 0.06 340 / 0.55), transparent 65%)",
        }}
      />
      {/* Blue-lavender wash from the opposite side */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 85% 80%, oklch(0.9 0.06 240 / 0.35), transparent 70%)",
        }}
      />
      {/* Very soft feathered edge (no dark vignette) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 55%, oklch(0.95 0.03 320 / 0.35) 100%)",
        }}
      />
    </>
  );
}