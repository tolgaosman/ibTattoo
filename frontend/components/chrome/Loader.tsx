"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

const SESSION_KEY = "ib-visited";
const DURATION_MS = 1500;

/**
 * First-visit opening. Mounted client-only (see Chrome.tsx) so the
 * sessionStorage check never causes a hydration mismatch.
 *
 * It used to count to 100 in monospace behind a progress bar — a loading
 * screen pretending to measure something. Now it just holds the name in the
 * script face for a beat and dissolves: the same pause, without the machinery.
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
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const hold = window.setTimeout(() => {
      setLeaving(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* private mode — show the opening again next time, harmless */
      }
    }, DURATION_MS);

    return () => window.clearTimeout(hold);
  }, [visible]);

  // Unmount only once the dissolve has finished, so nothing pops.
  useEffect(() => {
    if (!leaving) return;
    const done = window.setTimeout(() => setVisible(false), 900);
    return () => window.clearTimeout(done);
  }, [leaving]);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className={clsx(
        "fixed inset-0 z-[70] flex flex-col items-center justify-center bg-paper",
        "transition-opacity duration-[900ms] ease-out",
        leaving ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <span className="loader-name font-script text-[clamp(2rem,7vw,3.5rem)] leading-tight text-ink-soft">
        Irmak Bozkurt
      </span>
      <span aria-hidden className="loader-rule mt-6 h-px w-40 bg-amber/60" />
    </div>
  );
}
