import { HeroBackground } from "./HeroBackground";
import { HeroLinks } from "./HeroLinks";
import { HeroTagline } from "./HeroTagline";

import type { SiteContent } from "@/lib/db";

export function Hero({ hero }: { hero: SiteContent["hero"] }) {
  return (
    <section className="relative h-screen overflow-hidden bg-paper">
      <HeroBackground />

      {/* Scrim: the diorama's floor is a light warm tone right where the
          links sit, so text there needs reliable contrast on its own. This
          guarantees a dark ground under the bottom stack regardless of
          what's in the photo underneath. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-paper-deep/90 via-paper-deep/30 to-transparent" />

      {/* Tagline and links share one bottom-left column so they stack in flow
          instead of two independent absolute blocks fighting for the same
          strip — that's what let the links overlap each other on narrow
          screens. The diorama keeps the middle of the frame either way. */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 pr-16 sm:p-10 sm:pr-24">
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
