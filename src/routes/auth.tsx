import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  ssr: false,
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in — Phindile's Living Journal" },
      { name: "description", content: "Sign in to chat with Shamar and preserve your chapters." },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fn =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: window.location.origin },
          });
    const { error } = await fn;
    setBusy(false);
    if (error) setError(error.message);
    else navigate({ to: "/" });
  }

  async function google() {
    setError(null);
    const res = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (res.error) setError(res.error.message ?? "Google sign-in failed");
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{
        background:
          "radial-gradient(ellipse at top, oklch(0.97 0.02 80) 0%, oklch(0.92 0.05 30) 60%, oklch(0.85 0.06 25) 100%)",
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-[oklch(0.75_0.09_60_/_0.5)] bg-[oklch(0.98_0.02_80_/_0.9)] p-8 shadow-[0_20px_60px_rgba(120,80,60,0.25)] backdrop-blur">
        <p className="font-display text-[0.6rem] uppercase tracking-[0.5em] text-[oklch(0.5_0.1_25)]">
          שָׁמַר · Shamar
        </p>
        <h1 className="mt-2 font-display text-3xl italic text-[oklch(0.35_0.08_25)]">
          {mode === "signin" ? "Welcome home" : "Begin your journal"}
        </h1>
        <p className="mt-2 font-hand text-sm text-[oklch(0.45_0.08_25)]">
          Sign in to preserve every chapter of God's faithfulness.
        </p>

        <button
          type="button"
          onClick={google}
          className="mt-6 w-full rounded-md border border-[oklch(0.75_0.09_60_/_0.6)] bg-white/70 py-2.5 text-sm font-medium text-[oklch(0.35_0.08_25)] transition hover:bg-white"
        >
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.4em] text-[oklch(0.55_0.1_25)]">
          <div className="h-px flex-1 bg-[oklch(0.75_0.1_60_/_0.4)]" /> or
          <div className="h-px flex-1 bg-[oklch(0.75_0.1_60_/_0.4)]" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border border-[oklch(0.75_0.09_60_/_0.5)] bg-white/70 px-3 py-2 text-sm text-[oklch(0.3_0.06_25)] outline-none focus:border-[oklch(0.6_0.15_30)]"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-md border border-[oklch(0.75_0.09_60_/_0.5)] bg-white/70 px-3 py-2 text-sm text-[oklch(0.3_0.06_25)] outline-none focus:border-[oklch(0.6_0.15_30)]"
          />
          {error && <p className="text-xs text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-[oklch(0.5_0.15_25)] py-2.5 text-sm font-medium text-white transition hover:bg-[oklch(0.42_0.15_25)] disabled:opacity-60"
          >
            {busy ? "One moment…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-center text-xs text-[oklch(0.5_0.1_25)] underline underline-offset-2"
        >
          {mode === "signin"
            ? "New here? Create an account"
            : "Already have an account? Sign in"}
        </button>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-[oklch(0.55_0.1_25)] hover:underline">
            ← back to the journal
          </Link>
        </div>
      </div>
    </main>
  );
}