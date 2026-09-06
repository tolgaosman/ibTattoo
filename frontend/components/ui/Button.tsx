import Link from "next/link";
import { type VariantProps, cva } from "class-variance-authority";
import clsx from "clsx";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

/**
 * Soft pills, sentence case. The old shape — square corners, monospace caps,
 * wide tracking — was the loudest "technical" note on the site; the whole
 * button system is one file, so softening it here reaches the hero links, the
 * floating CTA and the booking form at once.
 *
 * Hover lifts and warms rather than inverting: nothing snaps.
 */
const buttonStyles = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-[var(--radius-pill)]",
    "font-sans text-sm font-medium tracking-[0.01em]",
    "transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-out",
    "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
  ],
  {
    variants: {
      intent: {
        primary:
          "border border-transparent bg-amber text-paper-deep shadow-[var(--glow-amber)] hover:bg-amber-light hover:shadow-[0_0_36px_-6px_rgb(209_140_64/0.6)]",
        ghost:
          "border border-[var(--hairline)] bg-parchment/50 text-ink-soft backdrop-blur-sm hover:border-[var(--hairline-warm)] hover:text-amber-light hover:shadow-[var(--glow-amber)]",
        plain: "border-none bg-transparent px-0 text-ink-soft hover:text-amber-light",
        whatsapp:
          "border border-transparent bg-[#25D366] text-white hover:bg-[#1fbb59] shadow-[0_0_28px_-8px_rgba(37,211,102,0.6)] hover:shadow-[0_0_34px_-6px_rgba(37,211,102,0.7)]",
        neon:
          "!font-serif !text-xl italic bg-transparent border-none px-3 text-amber drop-shadow-[0_0_8px_rgba(209,140,64,0.3)] underline decoration-amber/40 underline-offset-[6px] hover:text-[var(--color-neon-core)] hover:decoration-amber/80 hover:[text-shadow:var(--neon-glow)] transition-all",
      },
      size: {
        sm: "px-5 py-2.5",
        md: "px-7 py-3.5",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  },
);

type Variants = VariantProps<typeof buttonStyles>;

interface LinkButtonProps extends Variants, AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export function ButtonLink({ href, intent, size, className, ...props }: LinkButtonProps) {
  return (
    <Link href={href} className={clsx(buttonStyles({ intent, size }), className)} {...props} />
  );
}

interface ButtonProps extends Variants, ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ intent, size, className, ...props }: ButtonProps) {
  return <button className={clsx(buttonStyles({ intent, size }), className)} {...props} />;
}
