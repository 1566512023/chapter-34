import { useEffect, useRef, useState } from "react";
import { CHAPTER_MOODS, MOODS, loadPrefs, savePrefs, getPlayer } from "@/lib/soundscapes";

export function SoundscapePlayer({ chapterId }: { chapterId: string }) {
  const [on, setOn] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [expanded, setExpanded] = useState(false);
  const mounted = useRef(false);

  const moodId = CHAPTER_MOODS[chapterId] ?? "morning";
  const mood = MOODS[moodId];

  useEffect(() => {
    const p = loadPrefs();
    setOn(p.on);
    setVolume(p.volume);
    mounted.current = true;
    return () => { getPlayer()?.stop(); };
  }, []);

  // Restart the loop when the chapter/mood changes (if on)
  useEffect(() => {
    if (!mounted.current) return;
    const player = getPlayer();
    if (!player) return;
    if (on) { void player.play(mood); player.setVolume(volume); }
    else player.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moodId, on]);

  useEffect(() => {
    getPlayer()?.setVolume(on ? volume : 0);
  }, [volume, on]);

  const toggle = () => {
    const next = !on;
    setOn(next);
    savePrefs({ on: next, volume });
  };
  const onVol = (v: number) => {
    setVolume(v);
    savePrefs({ on, volume: v });
  };

  return (
    <div className="pointer-events-auto fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-[oklch(0.85_0.06_20_/_0.6)] bg-[oklch(0.98_0.02_20_/_0.85)] px-3 py-2 shadow-lg backdrop-blur">
      <button
        type="button"
        onClick={toggle}
        aria-label={on ? "Mute soundscape" : "Play soundscape"}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[oklch(0.9_0.08_20)] text-[oklch(0.4_0.12_20)] transition hover:bg-[oklch(0.85_0.1_20)]"
      >
        <span aria-hidden>{on ? "♪" : "♫"}</span>
      </button>
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="font-display text-[0.65rem] uppercase tracking-[0.25em] text-[oklch(0.45_0.1_20)] hover:text-[oklch(0.35_0.12_20)]"
      >
        {mood.label}
      </button>
      {expanded && (
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => onVol(Number(e.target.value))}
          aria-label="Volume"
          className="w-24 accent-[oklch(0.7_0.15_20)]"
        />
      )}
    </div>
  );
}