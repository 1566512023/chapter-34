import { useRouter, useRouterState, Link } from "@tanstack/react-router";

export function JournalBackButton() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Hide on the landing page — no page to go back to inside the journal.
  if (pathname === "/") return null;

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/journal" });
    }
  };

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Turn back a page"
      className="fixed left-4 top-[10.5rem] z-[70] group flex items-center gap-2 rounded-r-full border border-[oklch(0.75_0.09_60_/_0.55)] py-2 pl-3 pr-4 shadow-[0_8px_24px_rgba(120,80,50,0.25)] backdrop-blur-sm transition-transform hover:-translate-x-0 hover:translate-x-1 sm:top-[9rem]"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.94 0.03 80) 0%, oklch(0.88 0.06 30) 100%)",
      }}
    >
      <span
        className="font-display text-base italic leading-none"
        style={{ color: "oklch(0.5 0.1 25)" }}
        aria-hidden
      >
        ‹
      </span>
      <span
        className="font-hand text-sm"
        style={{ color: "oklch(0.45 0.08 25)" }}
      >
        previous page
      </span>
    </button>
  );
}

// Re-export Link for convenience if a page needs a hard-coded back target.
export { Link };