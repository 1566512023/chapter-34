import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import {
  attachJournalScripture,
  saveGratitude,
  saveJournalEntry,
  saveMemory,
  savePrayerEntry,
} from "@/lib/shamar-keeper.functions";
import {
  listLetters,
  listPrayerWall,
  markPrayerAnswered,
  saveLetter,
  saveScripture,
} from "@/lib/shamar-scripture.functions";
import { scriptureForToday, searchScripture } from "@/lib/scripture";
import { todaysEncouragement } from "@/lib/shamar";
import { ShamarChat } from "@/components/ShamarChat";
import { CHAPTER_MOODS, MOODS, getPlayer, loadPrefs, savePrefs } from "@/lib/soundscapes";

type Room =
  | "desk"
  | "journal"
  | "album"
  | "pray"
  | "prayerbook"
  | "reading"
  | "letters"
  | "gratitude"
  | "music"
  | "ask"
  | "about";

const INTRO_KEY = "phindile:shamar:intro-seen";

const ink = "oklch(0.35 0.06 25)";
const soft = "oklch(0.52 0.07 25)";
const gold = "oklch(0.72 0.11 82)";
const line = "oklch(0.85 0.07 85 / 0.6)";

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

function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function ShamarKeeper() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [room, setRoom] = useState<Room>("desk");
  const [session, setSession] = useState<Session | null>(null);
  const [introDone, setIntroDone] = useState(true);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const chapterId = pathname.startsWith("/chapter/")
    ? pathname.slice("/chapter/".length)
    : null;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIntroDone(localStorage.getItem(INTRO_KEY) === "1");
  }, [session]);

  function finishIntro() {
    try {
      localStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* private mode */
    }
    setIntroDone(true);
  }

  function close() {
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      setOpen(false);
      setRoom("desk");
    }, 620);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const firstName = "Phindile";

  return (
    <>
      <button
        type="button"
        onClick={() => (open ? close() : (setOpen(true), setRoom("desk")))}
        aria-label={open ? "Close the Writing Desk" : "Open the Writing Desk"}
        aria-expanded={open}
        title={open ? "Close Writing Desk" : "Open Writing Desk"}
        className="group fixed bottom-5 right-4 z-[74] flex h-13 w-13 items-center justify-center rounded-full border transition sm:bottom-6 sm:right-6"
        style={{
          height: "3.25rem",
          width: "3.25rem",
          borderColor: "oklch(0.84 0.06 85 / 0.7)",
          background: "linear-gradient(160deg, oklch(0.995 0.008 90), oklch(0.955 0.02 40))",
          boxShadow: "0 8px 22px oklch(0.6 0.06 30 / 0.18)",
        }}
      >
        <FountainPen className={!open && !closing ? "" : "pen-return"} />
        <span
          className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md border px-2 py-1 font-display text-[0.7rem] italic opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ borderColor: line, background: "oklch(0.99 0.01 90)", color: soft }}
        >
          Open Writing Desk
        </span>
      </button>

      {(open || closing) && (
        <div
          onClick={close}
          aria-hidden
          className={`fixed inset-0 z-[72] bg-[oklch(0.2_0.03_25_/_0.22)] backdrop-blur-[2px] transition-opacity duration-500 ${
            closing ? "opacity-0" : "opacity-100"
          }`}
        />
      )}

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="The Writing Desk"
        className={`fixed bottom-0 right-0 z-[73] flex h-[86vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border shadow-[0_-20px_60px_oklch(0.6_0.06_30_/_0.22)] transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] sm:bottom-24 sm:right-6 sm:h-[76vh] sm:rounded-2xl ${
          open && !closing ? "translate-y-0" : "translate-y-[115%]"
        } ${closing ? "desk-closing" : ""}`}
        style={{
          borderColor: "oklch(0.86 0.05 60 / 0.7)",
          background: "linear-gradient(180deg, oklch(0.995 0.008 88) 0%, oklch(0.975 0.018 30) 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'url("/paper.jpg")', backgroundSize: "cover" }}
        />
        <div
          className="pointer-events-none absolute inset-2 rounded-xl border"
          style={{ borderColor: "oklch(0.86 0.06 85 / 0.45)" }}
          aria-hidden
        />
        <header className="relative px-6 pt-6 pb-3">
          <p className="font-display text-[0.58rem] uppercase tracking-[0.5em]" style={{ color: soft }}>
            שָׁמַר · kept
          </p>
          <h2 className="mt-1 font-display text-2xl" style={{ color: ink }}>
            The Writing Desk
          </h2>
          <p className="font-display text-sm italic" style={{ color: soft }}>
            A quiet place to remember, reflect and preserve.
          </p>
          <div className="mt-3 h-px w-16" style={{ background: gold }} />
          {room !== "desk" && (
            <button
              type="button"
              onClick={() => setRoom("desk")}
              className="absolute right-14 top-4 rounded-md border px-2 py-1 font-display text-[0.55rem] uppercase tracking-[0.3em] hover:bg-white/50"
              style={{ borderColor: line, color: soft }}
            >
              Desk
            </button>
          )}
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-3 font-display text-xl"
            style={{ color: soft }}
            aria-label="Close the Writing Desk"
          >
            ×
          </button>
        </header>

        <div className="relative flex-1 overflow-y-auto px-6 pb-8">
          {!session ? (
            <SignedOut />
          ) : room === "desk" ? (
            <Desk name={firstName} prompt={prompt} onChoose={setRoom} />
          ) : room === "journal" ? (
            <JournalRoom />
          ) : room === "album" ? (
            <AlbumRoom userId={session.user.id} />
          ) : room === "pray" ? (
            <PrayRoom onBook={() => setRoom("prayerbook")} />
          ) : room === "prayerbook" ? (
            <PrayerBook />
          ) : room === "reading" ? (
            <ReadingRoom />
          ) : room === "letters" ? (
            <LetterChest />
          ) : (
            <GratitudeRoom />
          )}
        </div>
      </aside>
    </>
  );
}

function FountainPen({ className = "" }: { className?: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden className={className}>
      <path d="M7 25.5L9.6 20.2L21.8 8a2.6 2.6 0 0 1 3.7 3.7L13.3 23.9 7 25.5Z" fill="oklch(0.86 0.09 85)" stroke="oklch(0.6 0.09 60)" strokeWidth="0.9" strokeLinejoin="round" />
      <path d="M9.6 20.2L13.3 23.9" stroke="oklch(0.6 0.09 60)" strokeWidth="0.9" />
      <path d="M21.8 8l3.7 3.7" stroke="oklch(0.6 0.09 60)" strokeWidth="0.9" />
      <path d="M7 25.5l1.4-2.6 1.3 1.3L7 25.5Z" fill="oklch(0.4 0.06 30)" />
      <path d="M4 28.6c4-1.1 8-1.4 12-0.9" stroke="oklch(0.78 0.08 30)" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function SignedOut() {
  return (
    <div className="space-y-4">
      <p className="font-display italic" style={{ color: ink }}>
        The desk is kept for you alone.
      </p>
      <p className="font-display" style={{ color: soft }}>
        Sign in so your pages, prayers, letters and photographs can be preserved privately.
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

/* ---------- The desk ---------- */

function Desk({
  name,
  prompt,
  onChoose,
}: {
  name: string;
  prompt: string;
  onChoose: (r: Room) => void;
}) {
  const objects: { room: Room; icon: string; label: string; line: string }[] = [
    { room: "journal", icon: "✍🏻", label: "Journal", line: "Every page remembers." },
    { room: "album", icon: "📷", label: "Family Album", line: "Moments preserved with love." },
    { room: "pray", icon: "🙏", label: "Prayer Book", line: "Every prayer has a place." },
    { room: "reading", icon: "📖", label: "Reading Room", line: "Sit with Scripture." },
    { room: "letters", icon: "💌", label: "Letter Chest", line: "Words waiting for tomorrow." },
    { room: "gratitude", icon: "🌿", label: "Book of Gratitude", line: "Small mercies become lasting memories." },
  ];
  const today = useMemo(() => scriptureForToday(), []);
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="font-display text-lg" style={{ color: ink }}>
          {greeting()}, {name}.
        </p>
        <p className="font-script text-xl" style={{ color: soft }}>
          {prompt}
        </p>
      </div>

      <div className="space-y-1">
        {objects.map((o) => (
          <button
            key={o.room}
            type="button"
            onClick={() => onChoose(o.room)}
            className="flex w-full items-baseline gap-3 border-b py-3 text-left transition hover:pl-1"
            style={{ borderColor: "oklch(0.88 0.04 60 / 0.5)" }}
          >
            <span className="text-base" aria-hidden>
              {o.icon}
            </span>
            <span className="flex-1">
              <span className="block font-display text-lg" style={{ color: ink }}>
                {o.label}
              </span>
              <span className="block font-display text-sm italic" style={{ color: soft }}>
                {o.line}
              </span>
            </span>
          </button>
        ))}
      </div>

      {today && (
        <div className="rounded-lg border px-4 py-4" style={{ borderColor: line }}>
          <p className="font-display text-[0.55rem] uppercase tracking-[0.35em]" style={{ color: soft }}>
            Today's verse
          </p>
          <p className="mt-2 font-display italic" style={{ color: ink }}>
            {today.verse.text}
          </p>
          <p className="mt-1 font-display text-xs" style={{ color: soft }}>
            {today.verse.reference}
          </p>
        </div>
      )}
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
        style={{ borderColor: line, color: ink }}
      />
    </label>
  );
}

function Area(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    ref?: React.Ref<HTMLTextAreaElement>;
  },
) {
  return (
    <textarea
      {...props}
      className="w-full resize-none rounded-md border bg-white/70 px-3 py-2 text-sm outline-none"
      style={{ borderColor: line, color: ink }}
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
      style={{ borderColor: line, color: soft }}
    />
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display text-sm italic" style={{ color: soft }}>
      {children}
    </p>
  );
}

function RoomTitle({ title, line: sub }: { title: string; line: string }) {
  return (
    <div>
      <h3 className="font-display text-xl" style={{ color: ink }}>
        {title}
      </h3>
      <p className="font-display text-sm italic" style={{ color: soft }}>
        {sub}
      </p>
    </div>
  );
}

/* ---------- Journal ---------- */

function JournalRoom() {
  const save = useServerFn(saveJournalEntry);
  const attach = useServerFn(attachJournalScripture);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [settled, setSettled] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const today = useMemo(() => scriptureForToday(), []);
  useEffect(() => ref.current?.focus(), []);

  if (savedId) {
    return (
      <div className="space-y-4">
        <Prompt>Your page has been kept.</Prompt>
        {settled ? (
          <Note>Kept safely with today's page.</Note>
        ) : (
          <>
            {today && (
              <p className="font-display italic" style={{ color: ink }}>
                {today.verse.text} <span style={{ color: soft }}>— {today.verse.reference}</span>
              </p>
            )}
            <Note>Would you like this verse resting beside it?</Note>
            <div className="flex gap-2">
              <Primary
                disabled={busy || !today}
                onClick={async () => {
                  if (!today) return;
                  setBusy(true);
                  try {
                    await attach({
                      data: {
                        id: savedId,
                        scripture: `${today.verse.reference} — “${today.verse.text}”`.slice(0, 300),
                      },
                    });
                    setSettled(true);
                  } catch (e) {
                    setError((e as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Keep it here
              </Primary>
              <Quiet onClick={() => setSettled(true)}>Not today</Quiet>
            </div>
          </>
        )}
        <Quiet
          onClick={() => {
            setSavedId(null);
            setBody("");
            setSettled(false);
          }}
        >
          A new page
        </Quiet>
        {error && <p className="text-xs text-red-700">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <RoomTitle title="Journal" line="Every page remembers." />
      <Prompt>Today's page.</Prompt>
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
          Keep this page
        </Primary>
        <Quiet onClick={() => setBody("")}>Set aside</Quiet>
      </div>
      <Note>Private. Kept for you alone, unless you choose to share it one day.</Note>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}

/* ---------- Family Album ---------- */

function AlbumRoom({ userId }: { userId: string }) {
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
        <Note>It is waiting in the Family Album.</Note>
        <Quiet
          onClick={() => {
            setDone(false);
            reset();
          }}
        >
          Preserve another
        </Quiet>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <RoomTitle title="Family Album" line="Moments preserved with love." />
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
        label="Place (optional)"
        value={location}
        maxLength={160}
        onChange={(e) => setLocation(e.target.value)}
      />
      <Field
        label="Who was there (optional, separated by commas)"
        value={people}
        onChange={(e) => setPeople(e.target.value)}
      />
      <label className="block">
        <span className="font-display text-[0.55rem] uppercase tracking-[0.35em]" style={{ color: soft }}>
          Photographs (optional)
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
      {files.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-1">
          {files.map((f, i) => (
            <figure
              key={i}
              className="w-24 rotate-[-1.5deg] border bg-white p-1 pb-3 shadow-[0_4px_10px_oklch(0.5_0.05_30_/_0.2)]"
              style={{ borderColor: "oklch(0.9 0.02 60)" }}
            >
              <div className="h-16 w-full bg-[oklch(0.93_0.02_60)]" aria-hidden />
              <figcaption className="mt-1 truncate font-script text-[0.7rem]" style={{ color: soft }}>
                {f.name}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
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
          {busy ? "Preserving…" : "Preserve"}
        </Primary>
        <Quiet onClick={reset}>Set aside</Quiet>
      </div>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}

/* ---------- Prayer ---------- */

function PrayRoom({ onBook }: { onBook: () => void }) {
  const save = useServerFn(savePrayerEntry);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <div className="space-y-4">
        <Prompt>Your prayer has been kept.</Prompt>
        <Note>It rests in the Prayer Book, waiting before God.</Note>
        <div className="flex gap-2">
          <Quiet
            onClick={() => {
              setSaved(false);
              setText("");
            }}
          >
            Pray again
          </Quiet>
          <Quiet onClick={onBook}>Open the Prayer Book</Quiet>
        </div>
        {error && <p className="text-xs text-red-700">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <RoomTitle title="Prayer Book" line="Every prayer has a place." />
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
              await save({ data: { request: text.trim() } });
              setSaved(true);
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          Keep this prayer
        </Primary>
        <Quiet onClick={onBook}>Open the Prayer Book</Quiet>
      </div>
      <Note>Private prayer — kept for you alone.</Note>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}

type PrayerRow = {
  id: string;
  title: string | null;
  request: string;
  waiting: boolean | null;
  answered: boolean | null;
  answer_note: string | null;
};

function PrayerBook() {
  const list = useServerFn(listPrayerWall);
  const mark = useServerFn(markPrayerAnswered);
  const [rows, setRows] = useState<PrayerRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setRows((await list()) as unknown as PrayerRow[]);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  useEffect(() => {
    void load();
  }, []);

  if (error) return <p className="text-xs text-red-700">{error}</p>;
  if (!rows) return <Note>Turning the pages…</Note>;

  const waiting = rows.filter((r) => !r.answered);
  const remembered = rows.filter((r) => r.answered);

  return (
    <div className="space-y-6">
      <RoomTitle title="Prayer Book" line="Every prayer has a place." />
      <section className="space-y-3">
        <p className="font-display text-[0.55rem] uppercase tracking-[0.35em]" style={{ color: soft }}>
          Waiting Before God
        </p>
        {waiting.length === 0 && <Note>Nothing waiting on this page yet.</Note>}
        {waiting.map((p) => (
          <article key={p.id} className="border-b pb-3" style={{ borderColor: "oklch(0.88 0.04 60 / 0.5)" }}>
            <p className="font-display" style={{ color: ink }}>
              {p.title || p.request.slice(0, 90)}
            </p>
            <button
              type="button"
              className="mt-1 font-display text-xs italic underline"
              style={{ color: soft }}
              onClick={async () => {
                await mark({ data: { id: p.id, answered: true } });
                void load();
              }}
            >
              Move to Remembered
            </button>
          </article>
        ))}
      </section>
      <section className="space-y-3">
        <p className="font-display text-[0.55rem] uppercase tracking-[0.35em]" style={{ color: soft }}>
          Remembered · Book of Testimonies
        </p>
        {remembered.length === 0 && <Note>In time, this page fills on its own.</Note>}
        {remembered.map((p) => (
          <article key={p.id} className="border-b pb-3" style={{ borderColor: "oklch(0.88 0.04 60 / 0.5)" }}>
            <p className="font-display" style={{ color: ink }}>
              {p.title || p.request.slice(0, 90)}
            </p>
            {p.answer_note && (
              <p className="font-script text-sm" style={{ color: soft }}>
                {p.answer_note}
              </p>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}

/* ---------- Reading Room ---------- */

function ReadingRoom() {
  const keep = useServerFn(saveScripture);
  const today = useMemo(() => scriptureForToday(), []);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<{ theme: string; verse: { reference: string; text: string } }[] | null>(
    null,
  );
  const [kept, setKept] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function keepVerse(reference: string, text: string, theme?: string) {
    try {
      await keep({ data: { reference, verse_text: text, theme: theme ?? null } });
      setKept(reference);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <RoomTitle title="Reading Room" line="Sit with Scripture." />
      {today && (
        <div className="space-y-2">
          <p className="font-display text-lg italic" style={{ color: ink }}>
            {today.verse.text}
          </p>
          <p className="font-display text-xs" style={{ color: soft }}>
            {today.verse.reference}
          </p>
          <p className="font-script text-lg" style={{ color: soft }}>
            {today.reflection}
          </p>
          <Quiet onClick={() => keepVerse(today.verse.reference, today.verse.text)}>
            {kept === today.verse.reference ? "Kept" : "Keep this verse"}
          </Quiet>
        </div>
      )}

      <form
        className="space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          setResults(searchScripture(q, 12));
        }}
      >
        <Field
          label="Find a page"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="peace, waiting, my daughter…"
        />
        <Quiet type="submit">Look for it</Quiet>
      </form>

      {results && results.length === 0 && <Note>Nothing on that page yet — try another word.</Note>}
      {results?.map((r) => (
        <article key={r.verse.reference} className="border-b pb-3" style={{ borderColor: "oklch(0.88 0.04 60 / 0.5)" }}>
          <p className="font-display italic" style={{ color: ink }}>
            {r.verse.text}
          </p>
          <p className="mt-1 font-display text-xs" style={{ color: soft }}>
            {r.verse.reference} · {r.theme}
          </p>
          <button
            type="button"
            className="mt-1 font-display text-xs italic underline"
            style={{ color: soft }}
            onClick={() => keepVerse(r.verse.reference, r.verse.text, r.theme)}
          >
            {kept === r.verse.reference ? "Kept" : "Keep this verse"}
          </button>
        </article>
      ))}
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}

/* ---------- Letter Chest ---------- */

type LetterRow = { id: string; title: string; recipient: string | null; open_on: string | null };

function LetterChest() {
  const write = useServerFn(saveLetter);
  const list = useServerFn(listLetters);
  const [rows, setRows] = useState<LetterRow[] | null>(null);
  const [title, setTitle] = useState("");
  const [recipient, setRecipient] = useState("");
  const [openOn, setOpenOn] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setRows((await list()) as unknown as LetterRow[]);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-6">
      <RoomTitle title="Letter Chest" line="Words waiting for tomorrow." />
      <div className="space-y-3">
        <Field label="Title" value={title} maxLength={160} onChange={(e) => setTitle(e.target.value)} />
        <Field
          label="To (optional)"
          value={recipient}
          maxLength={120}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="My daughter, one day"
        />
        <Field label="To be opened on (optional)" type="date" value={openOn} onChange={(e) => setOpenOn(e.target.value)} />
        <Area rows={8} value={body} onChange={(e) => setBody(e.target.value)} placeholder="My dear…" />
        <Primary
          disabled={busy || !title.trim() || !body.trim()}
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              await write({
                data: {
                  title: title.trim(),
                  body: body.trim(),
                  recipient: recipient.trim() || null,
                  open_on: openOn || null,
                },
              });
              setTitle("");
              setRecipient("");
              setOpenOn("");
              setBody("");
              void load();
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Sealing…" : "Seal this letter"}
        </Primary>
      </div>

      <section className="space-y-2">
        <p className="font-display text-[0.55rem] uppercase tracking-[0.35em]" style={{ color: soft }}>
          Letters waiting
        </p>
        {rows && rows.length === 0 && <Note>The chest is empty for now.</Note>}
        {rows?.map((l) => (
          <article key={l.id} className="border-b pb-2" style={{ borderColor: "oklch(0.88 0.04 60 / 0.5)" }}>
            <p className="font-display" style={{ color: ink }}>
              {l.title}
            </p>
            <p className="font-display text-xs italic" style={{ color: soft }}>
              {l.recipient ? `To ${l.recipient}` : "Kept for you"}
              {l.open_on ? ` · opens ${l.open_on}` : ""}
            </p>
          </article>
        ))}
      </section>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}

/* ---------- Book of Gratitude ---------- */

function GratitudeRoom() {
  const save = useServerFn(saveGratitude);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="space-y-4">
        <Prompt>Another small mercy, kept.</Prompt>
        <Quiet
          onClick={() => {
            setDone(false);
            setText("");
            setCategory("");
          }}
        >
          Write another
        </Quiet>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <RoomTitle title="Book of Gratitude" line="Small mercies become lasting memories." />
      <Area rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="Even the smallest thing counts." />
      <div>
        <span className="font-display text-[0.55rem] uppercase tracking-[0.35em]" style={{ color: soft }}>
          Where it came from (optional)
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
          Keep this
        </Primary>
        <Quiet
          onClick={() => {
            setText("");
            setCategory("");
          }}
        >
          Set aside
        </Quiet>
      </div>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
