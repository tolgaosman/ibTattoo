import clsx from "clsx";
import type { HTMLAttributes } from "react";

/**
 * The quiet label above a heading, beside a value, on a form field. Set in
 * italic serif at sentence case rather than wide-tracked monospace caps —
 * a note pencilled in the margin, not a field name in a spec sheet.
 */
export function Eyebrow({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx("font-serif text-[0.95rem] italic tracking-[0.01em] text-muted", className)}
      {...props}
    >
      {children}
    </span>
  );
}
