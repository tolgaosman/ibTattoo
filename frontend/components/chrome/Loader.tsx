"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

const SESSION_KEY = "ib-visited";
const DURATION_MS = 1400;

/**
 * First-visit opening curtain. Mounted client-only (see Chrome.tsx) so the
 * sessionStorage check never causes a hydration mismatch.
 */
export function Loader() {
  // Lazy-initialized once from browser-only state — this component is
  // mounted client-only (see Chrome.tsx). Reduced-motion visitors skip the
  // curtain entirely, same as a returning visitor.
  const [visible, setVisible] = useState(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    try {
      return sessionStorage.getItem(SESSION_KEY) !== "1";
    } catch {
      return true;
    }
  });
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const finish = () => {
      setLeaving(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* private mode — show the loader again next time, harmless */
      }
      window.setTimeout(() => setVisible(false), 700);
    };

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION_MS);
      setCount(Math.floor(progress * 100));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className={clsx(
        "fixed inset-0 z-[70] flex flex-col items-center justify-center bg-paper transition-transform duration-700 ease-out",
        leaving ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Yükleniyor</span>
      <span className="mt-4 font-mono text-6xl tabular-nums text-ink">
        {String(count).padStart(2, "0")}
      </span>
      <div className="mt-6 h-px w-40 bg-sand">
        <div className="h-px bg-amber transition-[width] duration-100" style={{ width: `${count}%` }} />
      </div>
    </div>
  );
}
