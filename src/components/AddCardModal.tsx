import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

export interface AddCardField {
  name: string;
  label: string;
  placeholder?: string;
  textarea?: boolean;
  required?: boolean;
  maxLength?: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => Promise<void>;
  title: string;
  subtitle?: string;
  fields: AddCardField[];
  authed: boolean | null;
  submitLabel?: string;
  accent?: string;
}

export function AddCardModal({
  open,
  onClose,
  onSubmit,
  title,
  subtitle,
  fields,
  authed,
  submitLabel = "Add to the journal",
  accent = "oklch(0.6 0.15 20)",
}: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setValues({});
    setErr(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await onSubmit(values);
      onClose();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
      <article
        onClick={(e) => e.stopPropagation()}
        className="paper relative z-10 mx-auto w-full max-w-md rounded-sm px-8 py-8 shadow-2xl page-in"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-3 font-display text-2xl text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]"
          aria-label="Close"
        >
          ×
        </button>
        {subtitle && (
          <p className="font-display text-xs uppercase tracking-[0.4em]" style={{ color: accent }}>
            {subtitle}
          </p>
        )}
        <h2 className="mt-2 font-display text-2xl italic text-[color:var(--ink)]">{title}</h2>
        <div className="mt-3 h-px w-16" style={{ background: accent }} />

        {authed === false ? (
          <div className="mt-6 space-y-4">
            <p className="font-display text-[color:var(--ink)]">
              Sign in to add your own pages to the journal — they'll stay private to you.
            </p>
            <Link
              to="/auth"
              className="inline-block rounded-sm border px-5 py-2 font-display text-sm italic transition"
              style={{ borderColor: accent, color: accent }}
            >
              Sign in or create an account ›
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            {fields.map((f) => (
              <label key={f.name} className="block">
                <span className="font-display text-[0.7rem] uppercase tracking-[0.3em] text-[color:var(--ink-soft)]">
                  {f.label}
                </span>
                {f.textarea ? (
                  <textarea
                    required={f.required}
                    maxLength={f.maxLength ?? 1000}
                    rows={3}
                    placeholder={f.placeholder}
                    value={values[f.name] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                    className="mt-1 w-full rounded-sm border border-[oklch(0.75_0.08_60_/_0.5)] bg-white/60 px-3 py-2 font-hand text-base text-[color:var(--ink)] outline-none focus:border-[color:var(--ink)]"
                  />
                ) : (
                  <input
                    required={f.required}
                    maxLength={f.maxLength ?? 120}
                    placeholder={f.placeholder}
                    value={values[f.name] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                    className="mt-1 w-full rounded-sm border border-[oklch(0.75_0.08_60_/_0.5)] bg-white/60 px-3 py-2 font-hand text-base text-[color:var(--ink)] outline-none focus:border-[color:var(--ink)]"
                  />
                )}
              </label>
            ))}
            {err && <p className="text-xs text-red-700">{err}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-sm py-2.5 text-sm font-medium text-white transition disabled:opacity-60"
              style={{ background: accent }}
            >
              {busy ? "Saving…" : submitLabel}
            </button>
          </form>
        )}
      </article>
    </div>
  );
}