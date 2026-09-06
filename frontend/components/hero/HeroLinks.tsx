"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

/**
 * The site has no navbar, so these are the only way into the sections from the
 * top. They are pinned into the diorama's empty corners rather than lined up in
 * a bar — the first hint of the pinboard the rest of the page is built on.
 *
 * Below sm the scatter would collide with the wordmark, so they collapse into a
 * centred wrapping row above the scroll cue.
 */
const LINKS = [
  { href: "#sanatci", label: "Sanatçı", place: "sm:left-[11%] sm:top-[46%]", tilt: "-2.5deg" },
  { href: "#pano", label: "Pano", place: "sm:right-[13%] sm:top-[38%]", tilt: "2deg" },
  { href: "#surec", label: "Süreç", place: "sm:left-[17%] sm:bottom-[26%]", tilt: "1.5deg" },
  { href: "#iletisim", label: "Randevu", place: "sm:right-[10%] sm:bottom-[30%]", tilt: "-2deg" },
] as const;

export function HeroLinks() {
  const [shown, setShown] = useState(false);

  // One frame after mount so the transition actually runs from the 0 state.
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-32 flex flex-wrap items-center justify-center gap-2 px-6 sm:bottom-0 sm:top-0 sm:block sm:px-0">
      {LINKS.map((link, i) => (
        <a
          key={link.href}
          href={link.href}
          data-cursor="view"
          style={{
            transitionDelay: `${400 + i * 90}ms`,
            "--tilt": link.tilt,
          } as React.CSSProperties}
          className={clsx(
            "pointer-events-auto border border-sand/70 bg-paper/70 px-4 py-2 backdrop-blur-sm",
            "font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-soft",
            "drop-shadow-[0_2px_14px_rgba(244,239,230,0.7)]",
            "rotate-[var(--tilt)] transition-[opacity,transform,border-color,color] duration-700 ease-out",
            "hover:border-amber hover:text-amber hover:rotate-0",
            "sm:absolute",
            link.place,
            shown ? "opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
