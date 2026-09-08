import { HeroBackground } from "./HeroBackground";
import { HeroLinks } from "./HeroLinks";
import { HeroTagline } from "./HeroTagline";

import type { SiteContent } from "@/lib/db";

export function Hero({ hero }: { hero: SiteContent["hero"] }) {
  return (
    <section className="relative overflow-hidden bg-paper-deep sm:h-dvh sm:bg-paper">
      {/* Below sm the diorama is a wide landscape shot in a narrow, very tall
          viewport — object-cover on a full-height box would always show the
          whole image height (there's no vertical crop room to speak of when
          the box is that much taller than the photo's own aspect ratio),
          which reads as a dead beige band above the actual scene. Giving the
          image its own shorter band instead of stretching it to fill the
          screen keeps that margin proportionate, and the text sits below it
          in normal flow rather than pinned to the bottom of a screen-height
          box. From sm up there's enough width for cover to fill the frame
          properly, so the image goes back to full-bleed with text overlaid. */}
      <div className="relative h-[52svh] min-h-[280px] overflow-hidden sm:absolute sm:inset-0 sm:h-auto sm:min-h-0">
        <HeroBackground />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-paper-deep to-transparent sm:hidden" />
      </div>

      {/* Scrim: the diorama's floor is a light warm tone right where the
          links sit, so text there needs reliable contrast on its own. This
          guarantees a dark ground under the bottom stack regardless of
          what's in the photo underneath. Only needed from sm up, where text
          overlays the image directly. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-3/4 bg-gradient-to-t from-paper-deep/90 via-paper-deep/30 to-transparent sm:block" />

      {/* Tagline and links share one bottom-left column so they stack in flow
          instead of two independent absolute blocks fighting for the same
          strip — that's what let the links overlap each other on narrow
          screens. The diorama keeps the middle of the frame either way. */}
      <div className="relative flex flex-col gap-7 p-6 pt-8 sm:absolute sm:inset-0 sm:justify-end sm:gap-9 sm:p-10 sm:pr-24">
        <div className="flex w-full max-w-[min(94vw,860px)] flex-col items-start gap-7 sm:gap-9">
          <div className="pointer-events-none w-full">
            <h1
              className="hero-rise mb-4 font-hand text-4xl text-amber drop-shadow-[0_0_12px_var(--color-amber-light)] sm:text-5xl"
              style={{ animationDelay: "1300ms" }}
            >
              {hero.title}
            </h1>
            <HeroTagline tagline={hero.tagline} specialities={hero.specialities} />
          </div>

          <HeroLinks />
        </div>
      </div>
    </section>
  );
}
