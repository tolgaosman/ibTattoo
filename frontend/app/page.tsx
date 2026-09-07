import { Hero } from "@/components/hero/Hero";
import { Artist } from "@/components/sections/Artist";
import { Board } from "@/components/sections/Board";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";
import { getContent } from "@/lib/db";

/**
 * One page, top to bottom. Sections are separated by their ground — the board
 * surface against plain paper — rather than by a ruled divider, so the scroll
 * reads as one continuous surface instead of a stack of blocks.
 */
export default async function HomePage() {
  const content = await getContent();

  return (
    <>
      <Hero />

      <Artist about={content.about} image={content.aboutImage} />
      <Board selection={content.boardSelection} gallery={content.gallery} />
      <Process process={content.process} />
      <Contact contact={content.contact} />
    </>
  );
}
