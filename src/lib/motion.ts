import { createContext, useContext, useEffect, useState, type ReactNode, createElement } from "react";

const KEY = "phindile:reduced-motion";

type MotionCtx = { reduced: boolean; setReduced: (v: boolean) => void };

const Ctx = createContext<MotionCtx>({ reduced: false, setReduced: () => {} });

export function MotionProvider({ children }: { children: ReactNode }) {
  const [reduced, setReducedState] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored === "1") return applyAndSet(true);
      if (stored === "0") return applyAndSet(false);
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      applyAndSet(mq.matches);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyAndSet(v: boolean) {
    setReducedState(v);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-reduced-motion", v ? "true" : "false");
    }
  }

  const setReduced = (v: boolean) => {
    try { localStorage.setItem(KEY, v ? "1" : "0"); } catch {}
    applyAndSet(v);
  };

  return createElement(Ctx.Provider, { value: { reduced, setReduced } }, children);
}

export function useReducedMotion() {
  return useContext(Ctx);
}