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

      <h2 className="font-hand text-[clamp(3rem,8vw,5.5rem)] leading-[0.95] text-amber drop-shadow-[0_0_8px_rgba(209,140,64,0.3)]">
        {title}
      </h2>
    </div>
  );
}
