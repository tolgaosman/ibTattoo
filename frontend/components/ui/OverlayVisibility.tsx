"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

interface OverlayVisibilityContextValue {
  hidden: boolean;
  push: () => () => void;
}

const OverlayVisibilityContext = createContext<OverlayVisibilityContextValue | null>(null);

// Multiple overlays (lightbox, future modals) can be open at once; count them
// instead of a boolean so closing one doesn't reveal chrome while another is
// still open.
export function OverlayVisibilityProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const push = useCallback(() => {
    setCount((c) => c + 1);
    let released = false;
    return () => {
      if (released) return;
      released = true;
      setCount((c) => c - 1);
    };
  }, []);

  return (
    <OverlayVisibilityContext.Provider value={{ hidden: count > 0, push }}>
      {children}
    </OverlayVisibilityContext.Provider>
  );
}

export function useOverlayHidden() {
  const ctx = useContext(OverlayVisibilityContext);
  return ctx?.hidden ?? false;
}

// Registers/releases an overlay hold whenever `active` changes.
export function useOverlayHold(active: boolean) {
  const ctx = useContext(OverlayVisibilityContext);
  useEffect(() => {
    if (!ctx || !active) return;
    return ctx.push();
  }, [ctx, active]);
}
