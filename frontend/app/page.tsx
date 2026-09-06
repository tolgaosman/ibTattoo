import { Hero } from "@/components/hero/Hero";
import { Artist } from "@/components/sections/Artist";
import { Board } from "@/components/sections/Board";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";
import { RevealWords } from "@/components/ui/RevealWords";

/**
 * One page, top to bottom. Sections are separated by their ground — the board
 * surface against plain paper — rather than by a ruled divider, so the scroll
 * reads as one continuous surface instead of a stack of blocks.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="bg-paper px-6 py-28 sm:px-10 sm:py-36">
        <RevealWords
          text="Her dövme, deri üzerinde bırakılan ve geri dönüşü olmayan tek bir cümledir."
          className="mx-auto max-w-4xl text-center font-serif text-[clamp(1.75rem,4.5vw,3rem)] leading-[1.15] tracking-[-0.01em] text-ink"
        />
      </section>

      <Artist />
      <Board />
      <Process />
      <Contact />
    </>
  );
}
