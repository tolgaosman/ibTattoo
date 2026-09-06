import clsx from "clsx";
import { Eyebrow } from "./Label";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ eyebrow, title, align = "left", className }: SectionHeadingProps) {
  return (
    <div className={clsx("flex flex-col gap-3", align === "center" && "items-center text-center", className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-[-0.02em] text-ink">
        {title}
      </h2>
    </div>
  );
}
