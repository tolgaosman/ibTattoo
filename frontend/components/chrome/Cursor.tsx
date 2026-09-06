"use client";

import { useEffect, useRef, useState } from "react";

const LABELS: Record<string, string> = {
  view: "GÖR",
  book: "RANDEVU",
};

/**
 * Custom cursor for fine-pointer devices only. Dot tracks exactly; the ring
 * lags behind via rAF lerp and swells with a label when hovering a
 * data-cursor element. Everything moves on transform, never top/left.
 */
export function Cursor() {
  // Lazy-initialized from a one-time capability check — this component is
  // mounted client-only (see Chrome.tsx), so window is always available here.
  const [enabled] = useState(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return fine && !reduced;
  });
  const [label, setLabel] = useState<string | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("cursor-enabled");
    return () => document.documentElement.classList.remove("cursor-enabled");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    let visible = false;

    const onMove = (event: PointerEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
      if (!visible) {
        visible = true;
        dotRef.current?.style.setProperty("opacity", "1");
        ringRef.current?.style.setProperty("opacity", "1");
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      }

      const hovered = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(hovered ? LABELS[hovered.dataset.cursor ?? ""] ?? null : null);
    };

    const onLeave = () => {
      visible = false;
      dotRef.current?.style.setProperty("opacity", "0");
      ringRef.current?.style.setProperty("opacity", "0");
    };

    let frame: number;
    const tick = () => {
      ring.current.x += (target.current.x - ring.current.x) * 0.18;
      ring.current.y += (target.current.y - ring.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
      <div
        ref={dotRef}
        className="fixed top-0 left-0 h-1.5 w-1.5 rounded-full bg-amber opacity-0 transition-opacity duration-150"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 flex items-center justify-center rounded-full border border-amber opacity-0 transition-[width,height,opacity] duration-200 ease-out"
        style={{ width: label ? 64 : 32, height: label ? 64 : 32 }}
      >
        {label ? (
          <span className="font-serif text-xs italic text-amber">{label}</span>
        ) : null}
      </div>
    </div>
  );
}
