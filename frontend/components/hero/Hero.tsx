import { HeroBackground } from "./HeroBackground";
import { HeroLinks } from "./HeroLinks";

export function Hero() {
  return (
    <section className="relative h-screen overflow-hidden bg-paper">
      <HeroBackground />

      <div className="pointer-events-none absolute inset-x-0 top-[12vh] flex flex-col items-center px-6 text-center sm:top-[13vh]">
        <h1 className="font-serif text-[clamp(2.25rem,6.5vw,5.5rem)] leading-[0.95] tracking-[-0.02em] text-ink drop-shadow-[0_2px_16px_rgba(244,239,230,0.75)]">
          Irmak
          <br />
          Bozkurt
        </h1>
        <p className="mt-3 font-serif text-lg italic text-ink-soft drop-shadow-[0_1px_10px_rgba(244,239,230,0.7)]">
          Derideki Hikayeler.
        </p>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.24em] text-ink-soft drop-shadow-[0_1px_10px_rgba(244,239,230,0.7)]">
          İstanbul
        </p>
      </div>

      <HeroLinks />

      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft drop-shadow-[0_1px_8px_rgba(244,239,230,0.5)]">
          Kaydır
        </span>
        <span className="h-10 w-px bg-gradient-to-b from-amber to-transparent" />
      </div>
    </section>
  );
}
