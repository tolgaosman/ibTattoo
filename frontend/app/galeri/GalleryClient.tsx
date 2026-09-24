"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { formatStyle, type Tattoo } from "@/lib/tattoos";
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
      <div className="mx-auto max-w-[90rem]">
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

        {/* Same 4-column layout on every screen; spacing, frame and caption scale
            with viewport width so small screens show a smaller copy of the
            same page instead of a reflowed one. */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
          {tattoos.map((tattoo, i) => (
            <button
              key={tattoo.id}
              type="button"
              onClick={() => setIndex(i)}
              data-cursor="view"
              aria-label={`${tattoo.title} — ${formatStyle(tattoo.style)}`}
              className={clsx(
                "paper-card group relative block w-full p-2 pb-10 sm:p-2.5 sm:pb-12 text-left",
                "transition-[transform,box-shadow] duration-300 ease-out",
                "hover:z-20 hover:scale-[1.02]",
              )}
            >
              <span className="tape absolute left-1/2 top-0 h-4 w-12 sm:h-6 sm:w-20 -translate-x-1/2 -translate-y-1/2 rotate-[2deg] opacity-60 mix-blend-screen" />
              <span className={clsx("relative block overflow-hidden bg-parchment", IMAGE_ASPECT[tattoo.aspect])}>
                <Image
                  src={tattoo.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </span>
              <span className="absolute inset-x-2 sm:inset-x-3 bottom-0 truncate text-center font-hand text-sm sm:text-xl leading-[2.5] text-ink-soft">
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
