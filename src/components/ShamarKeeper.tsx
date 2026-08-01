import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import {
  attachJournalScripture,
  markPrayerWaiting,
  saveGratitude,
  saveJournalEntry,
  saveMemory,
  savePrayerEntry,
} from "@/lib/shamar-keeper.functions";

type View = "home" | "journal" | "memory" | "pray" | "gratitude";

const ink = "oklch(0.35 0.06 25)";
const soft = "oklch(0.52 0.07 25)";
const gold = "oklch(0.72 0.11 82)";

const PLACEHOLDER_SCRIPTURE =
  "Psalm 121:8 — “The Lord will watch over your coming and going both now and forevermore.”";

const GRATITUDE_CATEGORIES = [
  "God",
  "Family",
  "Daughter",
  "Friendship",
  "Love",
  "Law",
  "Business",
  "Health",
  "Personal growth",
  "Something small",
  "Other",
];

export function ShamarKeeper() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("home");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const firstName = "Phindile";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setView("home");
        }}
        aria-label={open ? "Close Shamar" : "Open Shamar, keeper of every chapter"}
        aria-expanded={open}
        className="shamar-breathe fixed bottom-5 right-4 z-[74] flex h-14 w-14 items-center justify-center rounded-full border sm:bottom-6 sm:right-6"
        style={{
          borderColor: "oklch(0.82 0.08 85 / 0.75)",
          background:
            "radial-gradient(circle at 35% 25%, oklch(0.99 0.02 90), oklch(0.93 0.05 30) 75%)",
        }}
      >
        <OliveBranch />
      </button>

      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={`fixed inset-0 z-[72] bg-[oklch(0.2_0.03_25_/_0.3)] backdrop-blur-sm transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shamar"
        className={`fixed bottom-0 right-0 z-[73] flex h-[86vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border shadow-[0_-20px_60px_oklch(0.6_0.06_30_/_0.28)] transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] sm:bottom-24 sm:right-6 sm:h-[76vh] sm:rounded-2xl ${
          open ? "translate-y-0" : "translate-y-[115%]"
        }`}
        style={{
          borderColor: "oklch(0.85 0.06 60 / 0.6)",
          background:
            "linear-gradient(180deg, oklch(0.99 0.012 90) 0%, oklch(0.96 0.03 20) 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-2 rounded-xl border"
          style={{ borderColor: "oklch(0.85 0.07 85 / 0.5)" }}
          aria-hidden
        />
        <header className="relative px-6 pt-6 pb-3">
          <p className="font-display text-[0.6rem] uppercase tracking-[0.5em]" style={{ color: soft }}>
            שָׁמַר · Shamar
          </p>
          <h2 className="mt-1 font-display text-2xl italic" style={{ color: ink }}>
            Keeper of Every Chapter
          </h2>
          <div className="mt-3 h-px w-16" style={{ background: gold }} />
          {view !== "home" && (
            <button
              type="button"
              onClick={() => setView("home")}
              className="absolute right-14 top-4 rounded-md border px-2 py-1 font-display text-[0.55rem] uppercase tracking-[0.3em] hover:bg-white/50"
              style={{ borderColor: "oklch(0.85 0.07 85 / 0.6)", color: soft }}
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-3 font-display text-xl"
            style={{ color: soft }}
            aria-label="Close Shamar"
          >
            ×
          </button>
        </header>

        <div className="relative flex-1 overflow-y-auto px-6 pb-8">
          {!session ? (
            <SignedOut />
          ) : view === "home" ? (
            <Home name={firstName} onChoose={setView} />
          ) : view === "journal" ? (
            <JournalFlow />
          ) : view === "memory" ? (
            <MemoryFlow userId={session.user.id} />
          ) : view === "pray" ? (
            <PrayerFlow />
          ) : (
            <GratitudeFlow />
          )}
        </div>
      </aside>
    </>
  );
}

function OliveBranch() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M6 27C10 20 15 13 26 6"
        stroke="oklch(0.55 0.07 140)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {[
        [11, 21],
        [15, 16],
        [19, 12],
        [23, 8.5],
      ].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x - 3} cy={y - 1} rx="3.1" ry="1.7" transform={`rotate(-35 ${x - 3} ${y - 1})`} fill="oklch(0.66 0.08 140)" />
          <ellipse cx={x + 2.4} cy={y + 1.4} rx="3.1" ry="1.7" transform={`rotate(-35 ${x + 2.4} ${y + 1.4})`} fill="oklch(0.74 0.07 140)" />
        </g>
      ))}
      <circle cx="24" cy="18" r="2.6" fill="oklch(0.82 0.12 85)" />
      <circle cx="19.5" cy="22.5" r="2" fill="oklch(0.88 0.1 85)" />
    </svg>
  );
}

function SignedOut() {
  return (
    <div className="space-y-4">
      <p className="font-display italic" style={{ color: ink }}>
        Shalom. I am Shamar (שָׁמַר) — entrusted with keeping what matters.
      </p>
      <p className="font-display" style={{ color: soft }}>
        Sign in so your journal, memories, prayers, and gratitude can be preserved safely and
        privately.
      </p>
      <Link
        to="/auth"
        className="inline-block rounded-md px-4 py-2 text-sm font-medium text-white transition"
        style={{ background: "oklch(0.6 0.13 20)" }}
      >
        Sign in
      </Link>
    </div>
  );
}

function Home({ name, onChoose }: { name: string; onChoose: (v: View) => void }) {
  const actions: { view: View; label: string; icon: string; note: string }[] = [
    { view: "journal", label: "Journal", icon: "📖", note: "Write what is on your heart" },
    { view: "memory", label: "Add Memory", icon: "📸", note: "Preserve a moment" },
    { view: "pray", label: "Pray", icon: "🙏", note: "Bring it before God" },
    { view: "gratitude", label: "Gratitude", icon: "🌿", note: "Remember His faithfulness" },
  ];
  return (
    <div className="space-y-5">
      <div className="space-y-2 font-display" style={{ color: ink }}>
        <p className="italic">Shalom, {name}.</p>
        <p>I am Shamar (שָׁמַר).</p>
        <p style={{ color: soft }}>
          I have been entrusted with helping preserve your memories, celebrate God's faithfulness,
          and continue writing the chapters still to come.
        </p>
        <p className="italic">What would you like to do today?</p>
      </div>
      <div className="grid gap-3">
        {actions.map((a) => (
          <button
            key={a.view}
            type="button"
            onClick={() => onChoose(a.view)}
            className="flex items-center gap-4 rounded-xl border px-4 py-4 text-left transition hover:-translate-y-0.5"
            style={{
              borderColor: "oklch(0.85 0.07 85 / 0.65)",
              background: "oklch(0.99 0.012 90 / 0.85)",
            }}
          >
            <span className="text-2xl" aria-hidden>
              {a.icon}
            </span>
            <span>
              <span className="block font-display text-lg italic" style={{ color: ink }}>
                {a.label}
              </span>
              <span className="block font-hand text-sm" style={{ color: soft }}>
                {a.note}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- shared bits ---------- */

function Prompt({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display text-lg italic" style={{ color: ink }}>
      {children}
    </p>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="font-display text-[0.55rem] uppercase tracking-[0.35em]" style={{ color: soft }}>
        {label}
      </span>
      <input
        {...props}
        className="mt-1 w-full rounded-md border bg-white/70 px-3 py-2 text-sm outline-none"
        style={{ borderColor: "oklch(0.85 0.07 85 / 0.6)", color: ink }}
      />
    </label>
  );
}

function Area(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full resize-none rounded-md border bg-white/70 px-3 py-2 text-sm outline-none"
      style={{ borderColor: "oklch(0.85 0.07 85 / 0.6)", color: ink }}
    />
  );
}

function Primary(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="rounded-md px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white transition disabled:opacity-50"
      style={{ background: "oklch(0.6 0.13 20)" }}
    />
  );
}

function Quiet(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="rounded-md border px-4 py-2 text-xs uppercase tracking-[0.2em] transition"
      style={{ borderColor: "oklch(0.85 0.07 85 / 0.6)", color: soft }}
    />
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-hand text-base" style={{ color: soft }}>
      {children}
    </p>
  );
}

/* ---------- Journal ---------- */

function JournalFlow() {
  const save = useServerFn(saveJournalEntry);
  const attach = useServerFn(attachJournalScripture);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [scriptureAdded, setScriptureAdded] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => ref.current?.focus(), []);

  if (savedId) {
    return (
      <div className="space-y-4">
        <Prompt>Your words have been preserved.</Prompt>
        {scriptureAdded ? (
          <>
            <Note>{PLACEHOLDER_SCRIPTURE}</Note>
            <Note>Kept safely with today's reflection.</Note>
          </>
        ) : (
          <>
            <Note>Would you like to add a Scripture to today's reflection?</Note>
            <div className="flex gap-2">
              <Primary
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await attach({ data: { id: savedId, scripture: PLACEHOLDER_SCRIPTURE } });
                    setScriptureAdded(true);
                  } catch (e) {
                    setError((e as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Yes, add Scripture
              </Primary>
              <Quiet onClick={() => setScriptureAdded(true)}>Not today</Quiet>
            </div>
          </>
        )}
        <Quiet
          onClick={() => {
            setSavedId(null);
            setBody("");
            setScriptureAdded(false);
          }}
        >
          Write another
        </Quiet>
        {error && <p className="text-xs text-red-700">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Prompt>What is on your heart today, Phindile?</Prompt>
      <Area
        ref={ref}
        rows={12}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write freely — nothing here is rushed."
      />
      <div className="flex gap-2">
        <Primary
          disabled={busy || !body.trim()}
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              const row = await save({ data: { body: body.trim() } });
              setSavedId(row.id);
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          Save to Journal
        </Primary>
        <Quiet onClick={() => setBody("")}>Cancel</Quiet>
      </div>
      <Note>Private. Kept for you alone, unless you choose to share it one day.</Note>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}

/* ---------- Memory ---------- */

function MemoryFlow({ userId }: { userId: string }) {
  const save = useServerFn(saveMemory);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [story, setStory] = useState("");
  const [location, setLocation] = useState("");
  const [people, setPeople] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function reset() {
    setTitle("");
    setDate("");
    setStory("");
    setLocation("");
    setPeople("");
    setFiles([]);
  }

  if (done) {
    return (
      <div className="space-y-4">
        <Prompt>This moment has been preserved.</Prompt>
        <Note>It will be waiting for you in your memories.</Note>
        <Quiet
          onClick={() => {
            setDone(false);
            reset();
          }}
        >
          Add another
        </Quiet>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Prompt>Let's preserve this moment.</Prompt>
      <Field
        label="Title"
        value={title}
        maxLength={160}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Coffee with my daughter"
      />
      <Field label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <label className="block">
        <span className="font-display text-[0.55rem] uppercase tracking-[0.35em]" style={{ color: soft }}>
          The memory
        </span>
        <Area
          rows={6}
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="She told me something hilarious today…"
        />
      </label>
      <Field
        label="Location (optional)"
        value={location}
        maxLength={160}
        onChange={(e) => setLocation(e.target.value)}
      />
      <Field
        label="People (optional, separated by commas)"
        value={people}
        onChange={(e) => setPeople(e.target.value)}
      />
      <label className="block">
        <span className="font-display text-[0.55rem] uppercase tracking-[0.35em]" style={{ color: soft }}>
          Photos or video (optional)
        </span>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="mt-1 w-full text-xs"
          style={{ color: soft }}
        />
      </label>
      {files.length > 0 && <Note>{files.length} file(s) ready to keep.</Note>}
      <div className="flex gap-2">
        <Primary
          disabled={busy || !title.trim()}
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              const paths: string[] = [];
              for (const file of files) {
                const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
                const path = `${userId}/${crypto.randomUUID()}-${safe}`;
                const { error: upErr } = await supabase.storage
                  .from("memories")
                  .upload(path, file, { upsert: false });
                if (upErr) throw new Error(upErr.message);
                paths.push(path);
              }
              await save({
                data: {
                  title: title.trim(),
                  memory_date: date || null,
                  story: story.trim() || null,
                  location: location.trim() || null,
                  people: people
                    .split(",")
                    .map((p) => p.trim())
                    .filter(Boolean)
                    .slice(0, 30),
                  media_paths: paths,
                },
              });
              setDone(true);
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Keeping…" : "Save Memory"}
        </Primary>
        <Quiet onClick={reset}>Cancel</Quiet>
      </div>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}

/* ---------- Prayer ---------- */

function PrayerFlow() {
  const save = useServerFn(savePrayerEntry);
  const mark = useServerFn(markPrayerWaiting);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [answered, setAnswered] = useState<null | boolean>(null);

  if (savedId) {
    return (
      <div className="space-y-4">
        <Prompt>Your prayer has been preserved.</Prompt>
        {answered === null ? (
          <>
            <Note>Would you like to mark this as a prayer you are waiting on?</Note>
            <div className="flex gap-2">
              <Primary
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await mark({ data: { id: savedId, waiting: true } });
                    setAnswered(true);
                  } catch (e) {
                    setError((e as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Yes — Waiting
              </Primary>
              <Quiet onClick={() => setAnswered(false)}>No</Quiet>
            </div>
          </>
        ) : (
          <Note>
            {answered
              ? "Held as a prayer you are waiting on."
              : "Kept quietly, just as you wrote it."}
          </Note>
        )}
        <Quiet
          onClick={() => {
            setSavedId(null);
            setText("");
            setAnswered(null);
          }}
        >
          Pray again
        </Quiet>
        {error && <p className="text-xs text-red-700">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Prompt>What would you like to bring before God today?</Prompt>
      <Area
        rows={10}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Take your time. This stays private."
      />
      <div className="flex gap-2">
        <Primary
          disabled={busy || !text.trim()}
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              const row = await save({ data: { request: text.trim() } });
              setSavedId(row.id);
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          Save Prayer
        </Primary>
        <Quiet onClick={() => setText("")}>Cancel</Quiet>
      </div>
      <Note>Private prayer — kept for you alone.</Note>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}

/* ---------- Gratitude ---------- */

function GratitudeFlow() {
  const save = useServerFn(saveGratitude);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="space-y-4">
        <Prompt>Another reminder of God's faithfulness has been preserved.</Prompt>
        <Quiet
          onClick={() => {
            setDone(false);
            setText("");
            setCategory("");
          }}
        >
          Add another
        </Quiet>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Prompt>What are you grateful for today?</Prompt>
      <Area rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="Even the smallest thing counts." />
      <div>
        <span className="font-display text-[0.55rem] uppercase tracking-[0.35em]" style={{ color: soft }}>
          Category (optional)
        </span>
        <div className="mt-2 flex flex-wrap gap-2">
          {GRATITUDE_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory((cur) => (cur === c ? "" : c))}
              className="rounded-full border px-3 py-1 text-xs transition"
              style={{
                borderColor: "oklch(0.85 0.07 85 / 0.7)",
                background: category === c ? "oklch(0.9 0.06 85 / 0.8)" : "transparent",
                color: ink,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Primary
          disabled={busy || !text.trim()}
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              await save({ data: { body: text.trim(), category: category || null } });
              setDone(true);
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          Save Gratitude
        </Primary>
        <Quiet
          onClick={() => {
            setText("");
            setCategory("");
          }}
        >
          Cancel
        </Quiet>
      </div>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}