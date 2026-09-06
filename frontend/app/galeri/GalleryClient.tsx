"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { STYLE_LABELS, type Tattoo } from "@/lib/tattoos";
import { Lightbox } from "@/components/work/Lightbox";
import { SectionHeading } from "@/components/ui/SectionHeading";

const IMAGE_ASPECT = {
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  landscape: "aspect-[5/4]",
} as const;

export function GalleryClient({ tattoos }: { tattoos: Tattoo[] }) {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <main className="bg-notebook min-h-screen px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="group mb-12 inline-flex items-center gap-2 font-hand text-xl text-ink-soft transition-colors hover:text-amber"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-1"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Ana Sayfaya Dön
        </Link>

        <SectionHeading title="Galeri" className="mb-16" />

        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {tattoos.map((tattoo, i) => (
            <button
              key={tattoo.id}
              type="button"
              onClick={() => setIndex(i)}
              data-cursor="view"
              aria-label={`${tattoo.title} — ${STYLE_LABELS[tattoo.style]}`}
              className={clsx(
                "paper-card group relative mb-6 block w-full break-inside-avoid p-2.5 pb-11 text-left",
                "transition-[transform,box-shadow] duration-300 ease-out",
                "hover:z-20 hover:scale-[1.02]",
              )}
            >
              <span className="tape absolute left-1/2 top-0 h-6 w-20 -translate-x-1/2 -translate-y-1/2 rotate-[2deg] opacity-60 mix-blend-screen" />
              <span className={clsx("relative block overflow-hidden bg-parchment", IMAGE_ASPECT[tattoo.aspect])}>
                <Image
                  src={tattoo.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </span>
              <span className="absolute inset-x-3 bottom-3 truncate text-center font-hand text-xl leading-none text-ink-soft">
                {tattoo.title.toLocaleLowerCase("tr-TR")}
              </span>
            </button>
          ))}
        </div>

        <Lightbox items={tattoos} index={index} onIndexChange={setIndex} />
      </div>
    </main>
  );
}
