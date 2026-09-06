import clsx from "clsx";
import type { HTMLAttributes } from "react";

/** Mono, uppercase, wide-tracked meta tag — style labels, dates, index numbers. */
export function Eyebrow({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        "font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
