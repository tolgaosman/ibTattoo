"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { usePointer } from "./usePointer";

/**
 * Full-bleed isometric tattoo-studio diorama behind the hero text: a soft
 * pointer-driven drift, rAF-into-DOM — no React state, so mouse movement
 * never triggers a re-render. No scroll-linked zoom: the scene stays put
 * once the page scrolls past it.
 */
export function HeroBackground() {
  const pointerRef = usePointer();
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    let x = 0;
    let y = 0;

    const tick = () => {
      const layer = layerRef.current;
      if (layer) {
        const pointer = pointerRef.current;

        x += (pointer.x * -16 - x) * 0.05;
        y += (pointer.y * -12 - y) * 0.05;

        // Scale has to ride along in this same string — a plain translate3d
        // here would replace the `scale-[1.06]` class's transform outright
        // (inline style wins over the stylesheet for the same property),
        // silently cancelling the zoom every frame once the loop starts.
        layer.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(1.06)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pointerRef]);

  return (
    <div ref={layerRef} className="absolute inset-0 scale-[1.06] will-change-transform">
      {/* The diorama sits in a wide landscape shot with a lot of plain wall
          and floor around it. Below sm this now lives in its own shorter
          band (see Hero.tsx) rather than a full-screen-height box, so cover
          only needs a modest horizontal shift toward the room — the plain
          margin above it reads as normal headroom instead of dead space.
          From sm up the box is wide enough that cover barely crops
          vertically, so centering keeps the hanging sign in frame too. */}
      <Image
        src="/images/hero/hero-studio-v2.webp"
        alt="İzometrik dövme stüdyosu diorama: dövmeci, sırtı dönük, yüzükoyun yatan bir müşteriye dövme yapıyor, arkadaki duvarda 'Irmak Bozkurt Tattoo Studio' yazan asma bir tabela var."
        fill
        priority
        unoptimized
        className="object-cover object-[22%_44%] sm:object-[50%_46%]"
      />
      {/* Lamp glow: a soft breathing warmth over the studio's work light. */}
      <div className="hero-lamp-glow pointer-events-none absolute left-[50%] top-[42%] h-[15%] w-[15%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-light/50 blur-2xl" />
    </div>
  );
}
