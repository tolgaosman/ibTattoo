"use client";

import { useEffect, useRef } from "react";

export interface PointerState {
  x: number;
  y: number;
}

/**
 * Pointer position normalized to [-1, 1], written straight into a ref.
 * Deliberately never touches React state — the hero scene reads this inside
 * useFrame every tick, and a re-render per mouse move would be wasteful.
 */
export function usePointer() {
  const pointer = useRef<PointerState>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return pointer;
}
