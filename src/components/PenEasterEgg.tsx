import { useEffect, useState } from "react";

export function PenEasterEgg() {
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    const trigger = () => setRunId((n) => n + 1);
    window.addEventListener("pen:drive", trigger);
    // Also listen for direct clicks on any element whose visible text is exactly "Pen".
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const text = (t.textContent ?? "").trim();
      if (text === "Pen" || t.dataset.pen === "true") trigger();
    };
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("pen:drive", trigger);
      document.removeEventListener("click", onClick);
    };
  }, []);

  if (runId === 0) return null;

  return (
    <div
      key={runId}
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[75] h-24 overflow-hidden"
      aria-hidden
    >
      <div className="pen-drive absolute bottom-0 left-0 flex items-end">
        <span className="pen-trail" />
        <span className="pen-trail" />
        <span className="pen-trail" />
        <span className="pen-car" role="img" aria-label="Pen the car">
          🚗
        </span>
      </div>
      <p className="pen-caption absolute inset-x-0 bottom-2 text-center font-script text-2xl gold-text">
        Every journey is another chapter of God's faithfulness.
      </p>
    </div>
  );
}