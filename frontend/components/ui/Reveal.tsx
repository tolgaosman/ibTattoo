"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import clsx from "clsx";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "span" | "li";
  /** Merged after the delay, so callers can pass positioning custom properties. */
  style?: CSSProperties;
}

/**
 * Scroll-triggered fade/rise. Plain CSS transition, not a JS animation library —
 * this is a one-shot enter effect, not springs or gestures.
 */
export function Reveal({ children, className, delay = 0, as = "div", style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag = as;

  return (
    <Tag
      ref={ref as never}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      className={clsx(
        "transition-[opacity,transform] duration-700 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
