"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface RevealWordsProps {
  text: string;
  className?: string;
}

/** Scroll-triggered word-by-word rise, each word masked and staggered. */
export function RevealWords({ text, className }: RevealWordsProps) {
  const ref = useRef<HTMLParagraphElement>(null);
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
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="mr-[0.28em] inline-block overflow-hidden align-top">
          <span
            className={clsx(
              "inline-block transition-[transform,opacity] duration-700 ease-out",
              visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
            )}
            style={{ transitionDelay: `${i * 28}ms` }}
          >
            {word}
          </span>
        </span>
      ))}
    </p>
  );
}
