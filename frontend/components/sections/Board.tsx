"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Lightbox } from "@/components/work/Lightbox";
import { Eyebrow } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { STYLE_LABELS, tattoos } from "@/lib/tattoos";

const boardTattoos = tattoos.slice(0, 9);

/**
 * The gallery, staged as the reference's corkboard: taped polaroids scattered
 * across the surface with handwritten notes pinned between them.
 *
 * The scatter is absolute-positioned percentages on lg+ and collapses to a
 * two-column flow below that, where the free placement would either overlap or
 * force a horizontal scroll. Every offset and tilt is a fixed literal — nothing
 * random, so the server and client render the same board.
 */

/** left / top / width as percentages of the board, the resting tilt, and the
    angle of the tape strip holding it — all fixed so nothing shifts on rerender. */
const PLACEMENT: ReadonlyArray<Placement> = [
  { x: "2%", y: "1%", w: "24%", r: "-3deg", tape: "5deg" },
  { x: "37%", y: "5%", w: "22%", r: "2.5deg", tape: "-6deg" },
  { x: "72%", y: "0%", w: "23%", r: "-1.5deg", tape: "3deg" },
  { x: "11%", y: "35%", w: "23%", r: "3deg", tape: "-4deg" },
  { x: "44%", y: "38%", w: "21%", r: "-2deg", tape: "7deg" },
  { x: "74%", y: "34%", w: "22%", r: "1.5deg", tape: "-3deg" },
  { x: "3%", y: "69%", w: "22%", r: "2deg", tape: "-7deg" },
  { x: "34%", y: "72%", w: "23%", r: "-2.5deg", tape: "4deg" },
  { x: "68%", y: "67%", w: "25%", r: "1deg", tape: "-5deg" },
];

interface Placement {
  x: string;
  y: string;
  w: string;
  r: string;
  tape: string;
}

const NOTES: ReadonlyArray<{ text: string; x: string; y: string; r: string }> = [
  { text: "#blackwork", x: "90%", y: "23%", r: "-6deg" },
  { text: "#ince çizgi", x: "1%", y: "24%", r: "5deg" },
  { text: "#dotwork", x: "37%", y: "61%", r: "-4deg" },
  { text: "#geometrik", x: "91%", y: "58%", r: "7deg" },
];

const IMAGE_ASPECT = {
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  landscape: "aspect-[5/4]",
} as const;

export function Board() {
  const [index, setIndex] = useState<number | null>(null);

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

      <div className="relative mx-auto max-w-6xl columns-2 gap-4 sm:gap-6 lg:block lg:columns-1 lg:h-[1240px]">
        {boardTattoos.map((tattoo, i) => {
          const place = PLACEMENT[i];
          return (
            <Polaroid
              key={tattoo.id}
              title={tattoo.title}
              image={tattoo.image}
              alt={`${tattoo.title} — ${STYLE_LABELS[tattoo.style]}`}
              aspect={IMAGE_ASPECT[tattoo.aspect]}
              place={place}
              priority={i < 3}
              onSelect={() => setIndex(i)}
            />
          );
        })}

        {NOTES.map((note) => (
          <span
            key={note.text}
            aria-hidden
            style={{ "--x": note.x, "--y": note.y, "--r": note.r } as CSSProperties}
            className="absolute left-[var(--x)] top-[var(--y)] hidden rotate-[var(--r)] bg-note px-3 py-2 font-hand text-xl leading-none text-ink-soft shadow-[0_8px_20px_-10px_rgba(0,0,0,0.85)] lg:block"
          >
            <span aria-hidden className="pin absolute -top-1.5 left-1/2 -translate-x-1/2" />
            {note.text}
          </span>
        ))}
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
        "paper-card group relative mb-4 block w-full break-inside-avoid p-2.5 pb-11 text-left sm:mb-6",
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
