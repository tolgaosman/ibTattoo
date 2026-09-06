import Link from "next/link";
import { type VariantProps, cva } from "class-variance-authority";
import clsx from "clsx";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

const buttonStyles = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-mono text-xs uppercase tracking-[0.14em]",
    "transition-[transform,background-color,border-color,color] duration-200 ease-out",
    "active:scale-[0.97]",
  ],
  {
    variants: {
      intent: {
        primary: "bg-amber text-paper border border-amber hover:bg-transparent hover:text-amber",
        ghost: "bg-transparent text-ink border border-sand hover:border-amber hover:text-amber",
        plain: "bg-transparent text-ink border-none px-0 hover:text-amber",
      },
      size: {
        sm: "px-4 py-2",
        md: "px-6 py-3.5",
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
