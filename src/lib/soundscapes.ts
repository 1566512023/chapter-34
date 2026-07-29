/**
 * Chapter-specific ambient soundscapes generated on the fly with the Web Audio
 * API — no downloads, no external assets. Each chapter maps to a mood that
 * layers sine/triangle drones and gentle noise to evoke the setting.
 */

export type MoodId =
  | "morning"
  | "garden"
  | "sanctuary"
  | "gallery"
  | "office"
  | "home"
  | "night"
  | "studio"
  | "library"
  | "scripture"
  | "prayer"
  | "courtroom"
  | "legacy"
  | "future";

export interface Mood {
  id: MoodId;
  label: string;
  /** Base frequencies for gentle drone chords, in Hz. */
  chord: number[];
  /** 0..1 amount of soft noise (birdsong-style shimmer). */
  noise: number;
  waveform?: OscillatorType;
}

export const MOODS: Record<MoodId, Mood> = {
  morning:   { id: "morning",   label: "Soft morning air",    chord: [220, 330, 440],      noise: 0.05, waveform: "sine" },
  garden:    { id: "garden",    label: "Birdsong garden",     chord: [261.6, 392, 523.2],  noise: 0.18, waveform: "sine" },
  sanctuary: { id: "sanctuary", label: "Sanctuary choir hum", chord: [174.6, 261.6, 349.2],noise: 0.02, waveform: "sine" },
  gallery:   { id: "gallery",   label: "Quiet gallery",       chord: [196, 293.7, 392],    noise: 0.03 },
  office:    { id: "office",    label: "Warm office",         chord: [220, 277.2, 329.6],  noise: 0.04 },
  home:      { id: "home",      label: "Fireside hush",       chord: [164.8, 246.9, 329.6],noise: 0.06 },
  night:     { id: "night",     label: "Starlit night",       chord: [130.8, 196, 261.6],  noise: 0.02 },
  studio:    { id: "studio",    label: "Creative studio",     chord: [246.9, 311.1, 415.3],noise: 0.05 },
  library:   { id: "library",   label: "Library stillness",   chord: [174.6, 220, 293.7],  noise: 0.03 },
  scripture: { id: "scripture", label: "Verse & candlelight", chord: [220, 329.6, 440],    noise: 0.02 },
  prayer:    { id: "prayer",    label: "Quiet prayer",        chord: [146.8, 220, 293.7],  noise: 0.01 },
  courtroom: { id: "courtroom", label: "Solemn hall",         chord: [130.8, 196, 261.6],  noise: 0.03 },
  legacy:    { id: "legacy",    label: "Family hearth",       chord: [196, 246.9, 329.6],  noise: 0.05 },
  future:    { id: "future",    label: "Open sky",            chord: [261.6, 329.6, 523.2],noise: 0.04 },
};

/** Map chapter ids to their mood. */
export const CHAPTER_MOODS: Record<string, MoodId> = {
  "before-time":  "morning",
  "thus-far":     "morning",
  "garden":       "garden",
  "foundation":   "sanctuary",
  "woman":        "gallery",
  "purpose":      "office",
  "little-hands": "home",
  "letters":      "studio",
  "faithfulness": "night",
  "dreams":       "studio",
  "memories":     "library",
  "love-letter":  "scripture",
  "prayer":       "prayer",
  "verdict":      "courtroom",
  "legacy":       "legacy",
  "future":       "future",
};

/** Volume/mute storage. */
const VOL_KEY = "phindile:soundscape:volume";
const ON_KEY  = "phindile:soundscape:on";

export function loadPrefs() {
  if (typeof window === "undefined") return { on: false, volume: 0.4 };
  const on = localStorage.getItem(ON_KEY) === "1";
  const v = Number(localStorage.getItem(VOL_KEY));
  const volume = Number.isFinite(v) && v >= 0 && v <= 1 ? v : 0.4;
  return { on, volume };
}
export function savePrefs(p: { on: boolean; volume: number }) {
  try {
    localStorage.setItem(ON_KEY, p.on ? "1" : "0");
    localStorage.setItem(VOL_KEY, String(p.volume));
  } catch {}
}

type Player = {
  play: (mood: Mood) => Promise<void>;
  stop: () => void;
  setVolume: (v: number) => void;
};

/** Create (or reuse) a shared WebAudio player. */
let cached: Player | null = null;
export function getPlayer(): Player | null {
  if (typeof window === "undefined") return null;
  if (cached) return cached;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  const nodes: { osc: OscillatorNode; gain: GainNode }[] = [];
  let noise: { src: AudioBufferSourceNode; gain: GainNode; filter: BiquadFilterNode } | null = null;

  const ensure = () => {
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.0001;
      master.connect(ctx.destination);
    }
    return ctx;
  };

  const stopAll = () => {
    for (const n of nodes) {
      try { n.osc.stop(); } catch {}
      try { n.osc.disconnect(); n.gain.disconnect(); } catch {}
    }
    nodes.length = 0;
    if (noise) {
      try { noise.src.stop(); } catch {}
      try { noise.src.disconnect(); noise.filter.disconnect(); noise.gain.disconnect(); } catch {}
      noise = null;
    }
  };

  cached = {
    async play(mood) {
      const c = ensure();
      if (c.state === "suspended") await c.resume();
      stopAll();
      const now = c.currentTime;
      for (const f of mood.chord) {
        const osc = c.createOscillator();
        osc.type = mood.waveform ?? "sine";
        osc.frequency.value = f;
        const g = c.createGain();
        g.gain.value = 0;
        g.gain.linearRampToValueAtTime(0.06, now + 2);
        osc.connect(g).connect(master!);
        osc.start();
        nodes.push({ osc, gain: g });
      }
      if (mood.noise > 0) {
        const bufSize = c.sampleRate * 2;
        const buffer = c.createBuffer(1, bufSize, c.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
        const src = c.createBufferSource();
        src.buffer = buffer;
        src.loop = true;
        const filter = c.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 2200;
        filter.Q.value = 0.9;
        const g = c.createGain();
        g.gain.value = 0;
        g.gain.linearRampToValueAtTime(mood.noise * 0.15, now + 3);
        src.connect(filter).connect(g).connect(master!);
        src.start();
        noise = { src, filter, gain: g };
      }
    },
    stop() {
      if (!ctx || !master) return;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      setTimeout(stopAll, 500);
    },
    setVolume(v) {
      if (!ctx || !master) return;
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.linearRampToValueAtTime(Math.max(0.0001, v), t + 0.2);
    },
  };
  return cached;
}