import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import {
  contextForChapter,
  shamarBlessing,
  shamarGreeting,
  todaysEncouragement,
} from "@/lib/shamar";
import {
  createThread,
  deleteThread,
  listThreads,
  loadThreadMessages,
} from "@/lib/shamar-chat.functions";

type Thread = { id: string; title: string; updated_at: string };

export function ShamarCompanion() {
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<UIMessage[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [showThreadList, setShowThreadList] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const listFn = useServerFn(listThreads);
  const createFn = useServerFn(createThread);
  const deleteFn = useServerFn(deleteThread);
  const loadFn = useServerFn(loadThreadMessages);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setSession(s);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!open || !session) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, session]);

  // Load threads whenever the panel opens for a signed-in user.
  useEffect(() => {
    if (!open || !session) return;
    setThreadsLoading(true);
    listFn()
      .then(async (rows) => {
        setThreads(rows as Thread[]);
        if (rows.length === 0) {
          const t = await createFn({ data: { title: "First chapter" } });
          setThreads([t as Thread]);
          setActiveThreadId((t as Thread).id);
          setThreadMessages([]);
        } else if (!activeThreadId) {
          setActiveThreadId((rows[0] as Thread).id);
        }
      })
      .finally(() => setThreadsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, session]);

  // Load messages when the active thread changes.
  useEffect(() => {
    if (!activeThreadId || !session) return;
    loadFn({ data: { threadId: activeThreadId } }).then((rows) => {
      setThreadMessages(
        rows.map((r) => ({ id: r.id, role: r.role, parts: r.parts })) as UIMessage[],
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeThreadId, session]);

  const activeId = pathname.startsWith("/chapter/")
    ? pathname.slice("/chapter/".length)
    : null;
  const ctx = contextForChapter(activeId);
  const encouragement = hydrated ? todaysEncouragement() : "";

  return (
    <>
      <FloatingTrigger open={open} onToggle={() => setOpen((o) => !o)} />
      <Backdrop open={open} onClose={() => setOpen(false)} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shamar — Keeper of Every Chapter"
        className={`fixed bottom-0 left-0 z-[71] flex h-[85vh] w-full max-w-md flex-col rounded-t-2xl border border-[oklch(0.78_0.09_60_/_0.5)] shadow-[0_-20px_60px_rgba(120,80,60,0.3)] transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] sm:bottom-6 sm:left-6 sm:h-[80vh] sm:rounded-2xl ${
          open ? "translate-y-0" : "translate-y-[110%]"
        }`}
        style={{
          background:
            "linear-gradient(180deg, oklch(0.97 0.02 80) 0%, oklch(0.92 0.04 30) 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-2 rounded-xl border border-[oklch(0.75_0.1_60_/_0.35)]" aria-hidden />
        <PanelHeader
          onClose={() => setOpen(false)}
          onToggleThreads={() => setShowThreadList((v) => !v)}
          threadsOpen={showThreadList}
          signedIn={!!session}
        />
        {!session ? (
          <SignedOutView ctx={ctx} encouragement={encouragement} />
        ) : (
          <ChatArea
            key={activeThreadId ?? "none"}
            threadId={activeThreadId}
            initialMessages={threadMessages}
            showThreadList={showThreadList}
            threads={threads}
            threadsLoading={threadsLoading}
            onSelect={(id) => {
              setActiveThreadId(id);
              setShowThreadList(false);
            }}
            onNew={async () => {
              const t = await createFn({ data: { title: "New chapter" } });
              setThreads((prev) => [t as Thread, ...prev]);
              setActiveThreadId((t as Thread).id);
              setThreadMessages([]);
              setShowThreadList(false);
            }}
            onDelete={async (id) => {
              await deleteFn({ data: { id } });
              setThreads((prev) => prev.filter((t) => t.id !== id));
              if (activeThreadId === id) {
                setActiveThreadId(threads.find((t) => t.id !== id)?.id ?? null);
                setThreadMessages([]);
              }
            }}
            ctx={ctx}
            encouragement={encouragement}
            onSignOut={async () => {
              await supabase.auth.signOut();
              setThreads([]);
              setActiveThreadId(null);
              setThreadMessages([]);
            }}
          />
        )}
      </aside>
    </>
  );
}

function FloatingTrigger({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={open ? "Close Shamar" : "Open Shamar, keeper of every chapter"}
      aria-expanded={open}
      className="fixed bottom-5 left-4 z-[72] flex items-center gap-2 rounded-full border border-[oklch(0.78_0.09_60_/_0.6)] px-4 py-2 shadow-[0_10px_30px_rgba(120,80,60,0.3)] transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:left-6"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.96 0.03 80) 0%, oklch(0.88 0.05 30) 100%)",
      }}
    >
      <span
        className="font-display text-lg italic leading-none"
        style={{ color: "oklch(0.5 0.1 25)" }}
        aria-hidden
      >
        שָׁמַר
      </span>
      <span
        className="font-display text-[0.65rem] uppercase tracking-[0.3em]"
        style={{ color: "oklch(0.45 0.08 25)" }}
      >
        {open ? "Close" : "Shamar"}
      </span>
    </button>
  );
}

function Backdrop({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-[68] bg-[oklch(0.2_0.03_25_/_0.35)] backdrop-blur-sm transition-opacity duration-500 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden
    />
  );
}

function PanelHeader({
  onClose,
  onToggleThreads,
  threadsOpen,
  signedIn,
}: {
  onClose: () => void;
  onToggleThreads: () => void;
  threadsOpen: boolean;
  signedIn: boolean;
}) {
  return (
    <header className="relative px-6 pt-6 pb-3">
      <p className="font-display text-[0.6rem] uppercase tracking-[0.5em] text-[oklch(0.5_0.1_25)]">
        שָׁמַר · Shamar
      </p>
      <h2 className="mt-1 font-display text-2xl italic text-[oklch(0.35_0.08_25)]">
        Keeper of Every Chapter
      </h2>
      <div className="mt-3 h-px w-16 bg-[oklch(0.7_0.11_60)]" />
      {signedIn && (
        <button
          type="button"
          onClick={onToggleThreads}
          className="absolute right-14 top-4 rounded-md border border-[oklch(0.75_0.1_60_/_0.4)] px-2 py-1 font-display text-[0.55rem] uppercase tracking-[0.3em] text-[oklch(0.5_0.1_25)] hover:bg-white/40"
        >
          {threadsOpen ? "Chat" : "Chapters"}
        </button>
      )}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-3 font-display text-xl text-[oklch(0.5_0.1_25)] hover:text-[oklch(0.35_0.1_25)]"
        aria-label="Close Shamar"
      >
        ×
      </button>
    </header>
  );
}

function SignedOutView({
  ctx,
  encouragement,
}: {
  ctx: ReturnType<typeof contextForChapter>;
  encouragement: string;
}) {
  return (
    <div className="relative flex-1 space-y-4 overflow-y-auto px-6 pb-6">
      <div className="space-y-1 font-display text-[color:oklch(0.35_0.06_25)]">
        {shamarGreeting.map((line, i) => (
          <p key={i} className={i === 0 ? "italic" : ""}>
            {line}
          </p>
        ))}
      </div>
      <div className="rounded-md border border-[oklch(0.75_0.1_60_/_0.35)] bg-[oklch(0.98_0.02_80_/_0.7)] p-4">
        <p className="font-display text-[0.6rem] uppercase tracking-[0.4em] text-[oklch(0.55_0.1_25)]">
          Today's Reflection
        </p>
        <p className="mt-2 font-hand text-base text-[oklch(0.35_0.08_25)]">
          {encouragement || "\u00a0"}
        </p>
      </div>
      <div className="rounded-md border border-[oklch(0.75_0.1_60_/_0.35)] bg-[oklch(0.98_0.02_80_/_0.7)] p-4">
        <p className="font-display text-[0.6rem] uppercase tracking-[0.4em] text-[oklch(0.55_0.1_25)]">
          {ctx.title}
        </p>
        <p className="mt-2 font-display italic text-[oklch(0.35_0.08_25)]">
          {ctx.prompt}
        </p>
        {ctx.scripture && (
          <p className="mt-2 font-display text-xs uppercase tracking-[0.3em] text-[oklch(0.55_0.1_25)]">
            {ctx.scripture}
          </p>
        )}
      </div>
      <div className="rounded-md border border-[oklch(0.75_0.1_60_/_0.5)] bg-[oklch(0.99_0.01_80_/_0.9)] p-4 text-center">
        <p className="font-display text-sm text-[oklch(0.4_0.08_25)]">
          Sign in to chat with Shamar and preserve every chapter.
        </p>
        <Link
          to="/auth"
          className="mt-3 inline-block rounded-md bg-[oklch(0.5_0.15_25)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[oklch(0.42_0.15_25)]"
        >
          Sign in
        </Link>
      </div>
      <p className="font-hand text-sm italic text-[oklch(0.5_0.08_25)]">
        {shamarBlessing}
      </p>
    </div>
  );
}

function ChatArea({
  threadId,
  initialMessages,
  showThreadList,
  threads,
  threadsLoading,
  onSelect,
  onNew,
  onDelete,
  ctx,
  encouragement,
  onSignOut,
}: {
  threadId: string | null;
  initialMessages: UIMessage[];
  showThreadList: boolean;
  threads: Thread[];
  threadsLoading: boolean;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  ctx: ReturnType<typeof contextForChapter>;
  encouragement: string;
  onSignOut: () => void;
}) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        fetch: async (input, init) => {
          const { data } = await supabase.auth.getSession();
          const token = data.session?.access_token;
          const headers = new Headers(init?.headers);
          if (token) headers.set("Authorization", `Bearer ${token}`);
          return fetch(input as RequestInfo, { ...init, headers });
        },
        prepareSendMessagesRequest: ({ messages, body }) => ({
          body: { messages, threadId, ...(body ?? {}) },
        }),
      }),
    [threadId],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: threadId ?? undefined,
    messages: initialMessages,
    transport,
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [threadId, status]);

  const isBusy = status === "submitted" || status === "streaming";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || !threadId || isBusy) return;
    setInput("");
    await sendMessage({ text });
  }

  if (showThreadList) {
    return (
      <div className="relative flex flex-1 flex-col overflow-hidden px-4 pb-4">
        <div className="flex items-center justify-between px-2 pb-2">
          <p className="font-display text-[0.6rem] uppercase tracking-[0.4em] text-[oklch(0.5_0.1_25)]">
            Your chapters
          </p>
          <button
            type="button"
            onClick={onNew}
            className="rounded-md bg-[oklch(0.5_0.15_25)] px-3 py-1 text-xs font-medium text-white hover:bg-[oklch(0.42_0.15_25)]"
          >
            + New
          </button>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {threadsLoading && (
            <p className="px-2 font-hand text-sm text-[oklch(0.5_0.08_25)]">Gathering pages…</p>
          )}
          {threads.map((t) => (
            <div
              key={t.id}
              className={`flex items-center gap-2 rounded-md border border-[oklch(0.75_0.1_60_/_0.35)] bg-[oklch(0.98_0.02_80_/_0.7)] px-3 py-2 ${
                t.id === threadId ? "ring-2 ring-[oklch(0.6_0.15_30)]" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(t.id)}
                className="flex-1 text-left"
              >
                <p className="font-display italic text-[oklch(0.35_0.08_25)]">{t.title}</p>
                <p className="font-display text-[0.55rem] uppercase tracking-[0.3em] text-[oklch(0.55_0.1_25)]">
                  {new Date(t.updated_at).toLocaleString()}
                </p>
              </button>
              <button
                type="button"
                onClick={() => onDelete(t.id)}
                aria-label="Delete chapter"
                className="text-[oklch(0.55_0.15_25)] hover:text-[oklch(0.35_0.15_25)]"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="mt-3 text-center text-[0.6rem] uppercase tracking-[0.3em] text-[oklch(0.55_0.1_25)] hover:underline"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden px-4 pb-4">
      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto px-2 pb-3"
      >
        {messages.length === 0 && (
          <div className="space-y-3">
            <div className="space-y-1 font-display text-[color:oklch(0.35_0.06_25)]">
              {shamarGreeting.map((line, i) => (
                <p key={i} className={i === 0 ? "italic" : ""}>
                  {line}
                </p>
              ))}
            </div>
            <div className="rounded-md border border-[oklch(0.75_0.1_60_/_0.35)] bg-[oklch(0.98_0.02_80_/_0.6)] p-3">
              <p className="font-display text-[0.55rem] uppercase tracking-[0.4em] text-[oklch(0.55_0.1_25)]">
                Today's Reflection
              </p>
              <p className="mt-1 font-hand text-sm text-[oklch(0.35_0.08_25)]">
                {encouragement || "\u00a0"}
              </p>
            </div>
            <div className="rounded-md border border-[oklch(0.75_0.1_60_/_0.35)] bg-[oklch(0.98_0.02_80_/_0.6)] p-3">
              <p className="font-display text-[0.55rem] uppercase tracking-[0.4em] text-[oklch(0.55_0.1_25)]">
                {ctx.title}
              </p>
              <p className="mt-1 font-display italic text-[oklch(0.35_0.08_25)]">
                {ctx.prompt}
              </p>
              {ctx.scripture && (
                <p className="mt-1 font-display text-[0.55rem] uppercase tracking-[0.3em] text-[oklch(0.55_0.1_25)]">
                  {ctx.scripture}
                </p>
              )}
            </div>
          </div>
        )}

        {messages.map((m) => {
          const text = m.parts
            .map((p) => (p.type === "text" ? p.text : ""))
            .join("");
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                  isUser
                    ? "bg-[oklch(0.5_0.15_25)] text-white"
                    : "font-display text-[oklch(0.3_0.06_25)]"
                }`}
              >
                {text}
              </div>
            </div>
          );
        })}

        {status === "submitted" && (
          <p className="font-hand text-sm italic text-[oklch(0.5_0.08_25)]">
            Shamar is thinking…
          </p>
        )}
        {error && (
          <p className="text-xs text-red-700">
            Something went wrong: {error.message}
          </p>
        )}
      </div>

      <form
        onSubmit={submit}
        className="flex items-end gap-2 rounded-xl border border-[oklch(0.75_0.1_60_/_0.5)] bg-[oklch(0.99_0.01_80_/_0.9)] p-2"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(e as unknown as React.FormEvent);
            }
          }}
          rows={2}
          placeholder={
            threadId
              ? "Share a memory, an anxiety, a prayer…"
              : "Loading your chapter…"
          }
          disabled={!threadId || isBusy}
          className="flex-1 resize-none bg-transparent px-2 py-1 text-sm text-[oklch(0.3_0.06_25)] outline-none placeholder:text-[oklch(0.55_0.08_25)]"
        />
        <button
          type="submit"
          disabled={!threadId || isBusy || !input.trim()}
          className="rounded-md bg-[oklch(0.5_0.15_25)] px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[oklch(0.42_0.15_25)] disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}

  return (
    <>
      {/* Floating Shamar trigger — bottom-left corner */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Shamar" : "Open Shamar, keeper of every chapter"}
        aria-expanded={open}
        className="fixed bottom-5 left-4 z-[72] flex items-center gap-2 rounded-full border border-[oklch(0.78_0.09_60_/_0.6)] px-4 py-2 shadow-[0_10px_30px_rgba(120,80,60,0.3)] transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:left-6"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.96 0.03 80) 0%, oklch(0.88 0.05 30) 100%)",
        }}
      >
        <span
          className="font-display text-lg italic leading-none"
          style={{ color: "oklch(0.5 0.1 25)" }}
          aria-hidden
        >
          שָׁמַר
        </span>
        <span
          className="font-display text-[0.65rem] uppercase tracking-[0.3em]"
          style={{ color: "oklch(0.45 0.08 25)" }}
        >
          {open ? "Close" : "Shamar"}
        </span>
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[68] bg-[oklch(0.2_0.03_25_/_0.35)] backdrop-blur-sm transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      />

      {/* Slide-up companion panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shamar — Keeper of Every Chapter"
        className={`fixed bottom-0 left-0 z-[71] w-full max-w-md rounded-t-2xl border border-[oklch(0.78_0.09_60_/_0.5)] p-6 shadow-[0_-20px_60px_rgba(120,80,60,0.3)] transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] sm:bottom-6 sm:left-6 sm:rounded-2xl ${
          open ? "translate-y-0" : "translate-y-[110%]"
        }`}
        style={{
          background:
            "linear-gradient(180deg, oklch(0.97 0.02 80) 0%, oklch(0.92 0.04 30) 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-2 rounded-xl border border-[oklch(0.75_0.1_60_/_0.35)]" aria-hidden />

        <header className="relative">
          <p className="font-display text-[0.6rem] uppercase tracking-[0.5em] text-[oklch(0.5_0.1_25)]">
            שָׁמַר · Shamar
          </p>
          <h2 className="mt-1 font-display text-2xl italic text-[oklch(0.35_0.08_25)]">
            Keeper of Every Chapter
          </h2>
          <div className="mt-3 h-px w-16 bg-[oklch(0.7_0.11_60)]" />
        </header>

        <div className="relative mt-4 max-h-[55vh] space-y-4 overflow-y-auto pr-1">
          <div className="space-y-1 font-display text-[color:oklch(0.35_0.06_25)]">
            {shamarGreeting.map((line, i) => (
              <p key={i} className={i === 0 ? "italic" : ""}>
                {line}
              </p>
            ))}
          </div>

          <div className="rounded-md border border-[oklch(0.75_0.1_60_/_0.35)] bg-[oklch(0.98_0.02_80_/_0.6)] p-4">
            <p className="font-display text-[0.6rem] uppercase tracking-[0.4em] text-[oklch(0.55_0.1_25)]">
              Today's Reflection
            </p>
            <p className="mt-2 font-hand text-base text-[oklch(0.35_0.08_25)]">
              {encouragement || "\u00a0"}
            </p>
          </div>

          <div className="rounded-md border border-[oklch(0.75_0.1_60_/_0.35)] bg-[oklch(0.98_0.02_80_/_0.6)] p-4">
            <p className="font-display text-[0.6rem] uppercase tracking-[0.4em] text-[oklch(0.55_0.1_25)]">
              {ctx.title}
            </p>
            <p className="mt-2 font-display italic text-[oklch(0.35_0.08_25)]">
              {ctx.prompt}
            </p>
            {ctx.scripture && (
              <p className="mt-2 font-display text-xs uppercase tracking-[0.3em] text-[oklch(0.55_0.1_25)]">
                {ctx.scripture}
              </p>
            )}
          </div>

          <p className="font-hand text-sm italic text-[oklch(0.5_0.08_25)]">
            {shamarBlessing}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-3 font-display text-xl text-[oklch(0.5_0.1_25)] hover:text-[oklch(0.35_0.1_25)]"
          aria-label="Close Shamar"
        >
          ×
        </button>
      </aside>
    </>
  );
}