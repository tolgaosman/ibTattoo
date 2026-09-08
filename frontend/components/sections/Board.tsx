"use client";

import { useState, type CSSProperties, useMemo } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Lightbox } from "@/components/work/Lightbox";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { formatStyle, type Tattoo } from "@/lib/tattoos";

const PLACEMENT: ReadonlyArray<Placement> = [
  { x: "0%", y: "1%", w: "28%", r: "-3deg", tape: "5deg" },
  { x: "35%", y: "5%", w: "26%", r: "2.5deg", tape: "-6deg" },
  { x: "70%", y: "0%", w: "27%", r: "-1.5deg", tape: "3deg" },
  { x: "9%", y: "35%", w: "27%", r: "3deg", tape: "-4deg" },
  { x: "42%", y: "38%", w: "25%", r: "-2deg", tape: "7deg" },
  { x: "72%", y: "34%", w: "26%", r: "1.5deg", tape: "-3deg" },
  { x: "1%", y: "69%", w: "26%", r: "2deg", tape: "-7deg" },
  { x: "32%", y: "72%", w: "27%", r: "-2.5deg", tape: "4deg" },
  { x: "66%", y: "67%", w: "29%", r: "1deg", tape: "-5deg" },
];

interface Placement {
  x: string;
  y: string;
  w: string;
  r: string;
  tape: string;
}

const IMAGE_ASPECT = {
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  landscape: "aspect-[5/4]",
} as const;

interface BoardProps {
  selection: string[];
  gallery: Tattoo[];
}

export function Board({ selection, gallery }: BoardProps) {
  const [index, setIndex] = useState<number | null>(null);

  const boardTattoos = useMemo(() => {
    return selection
      .map((id) => gallery.find((t) => t.id === id))
      .filter((t): t is Tattoo => t !== undefined)
      .slice(0, 9);
  }, [selection, gallery]);

  return (
    <section id="pano" className="bg-notebook px-6 py-24 sm:px-10 sm:py-32">
      <Reveal className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center sm:mb-24">

        <h2 className="font-hand text-[clamp(3rem,8vw,5.5rem)] leading-[0.95] text-amber drop-shadow-[0_0_8px_rgba(209,140,64,0.3)]">
          Pano
        </h2>
        <p className="max-w-md leading-relaxed text-ink/75">
          Son dönemde tamamlanan işler. Birine dokun, hikayesini oku.
        </p>
      </Reveal>

      <div className="relative mx-auto max-w-6xl columns-1 gap-6 sm:columns-2 sm:gap-6 lg:block lg:columns-1 lg:h-[1350px]">
        {boardTattoos.map((tattoo, i) => {
          const place = PLACEMENT[i];
          return (
            <Polaroid
              key={tattoo.id}
              title={tattoo.title}
              image={tattoo.image}
              alt={`${tattoo.title} — ${formatStyle(tattoo.style)}`}
              aspect={IMAGE_ASPECT[tattoo.aspect]}
              place={place}
              priority={i < 3}
              onSelect={() => setIndex(i)}
            />
          );
        })}
      </div>

      <div className="mt-16 flex justify-center lg:mt-0 lg:pt-20">
        <ButtonLink href="/galeri" intent="ghost" size="md">
          Tümünü Gör
        </ButtonLink>
      </div>

      <Lightbox items={boardTattoos} index={index} onIndexChange={setIndex} />
    </section>
  );
}

function Polaroid({
  title,
  image,
  alt,
  aspect,
  place,
  priority,
  onSelect,
}: {
  title: string;
  image: string;
  alt: string;
  aspect: string;
  place: Placement;
  priority: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      data-cursor="view"
      aria-label={alt}
      style={
        {
          "--x": place.x,
          "--y": place.y,
          "--w": place.w,
          "--r": place.r,
          "--tape": place.tape,
        } as CSSProperties
      }
      className={clsx(
        "paper-card group relative mx-auto mb-12 block w-[88%] break-inside-avoid p-2.5 pb-11 text-left sm:mb-8 sm:w-full",
        "rotate-[calc(var(--r)*0.5)] transition-[transform,box-shadow] duration-300 ease-out",
        "hover:z-20 hover:rotate-0 hover:scale-[1.03]",
        "lg:absolute lg:left-[var(--x)] lg:top-[var(--y)] lg:mb-0 lg:w-[var(--w)] lg:rotate-[var(--r)]",
      )}
    >
      <span className="tape absolute left-1/2 top-0 h-6 w-20 -translate-x-1/2 -translate-y-1/2 rotate-[var(--tape)]" />
      <span className={clsx("relative block overflow-hidden bg-parchment", aspect)}>
        <Image
          src={image}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 24vw, 45vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </span>
      <span className="absolute inset-x-3 bottom-3 truncate text-center font-hand text-xl leading-none text-ink-soft">
        {title.toLocaleLowerCase("tr-TR")}
      </span>
    </button>
  );
}
