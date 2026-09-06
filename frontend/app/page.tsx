import { Hero } from "@/components/hero/Hero";
import { Artist } from "@/components/sections/Artist";
import { Board } from "@/components/sections/Board";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";

/**
 * One page, top to bottom. Sections are separated by their ground — the board
 * surface against plain paper — rather than by a ruled divider, so the scroll
 * reads as one continuous surface instead of a stack of blocks.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      <Artist />
      <Board />
      <Process />
      <Contact />
    </>
  );
}
