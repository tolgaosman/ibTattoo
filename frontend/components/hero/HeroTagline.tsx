/**
 * Sits under the neon sign: a line of intent in italic serif, a hairline that
 * fades out at both ends, and the specialities set quietly in sentence case.
 *
 * The typewriter that used to live here was the most "machine" thing on the
 * page — this arrives instead, on one calm fade-up. No client JS, so this is a
 * server component; the reduced-motion block in globals.css collapses the
 * entrance to nothing on its own.
 */
export function HeroTagline({ tagline, specialities }: { tagline: string; specialities: string[] }) {
  return (
    <div className="hero-rise flex flex-col gap-4" style={{ animationDelay: "1500ms" }}>
      <p className="font-hand text-base text-ink-soft/70 drop-shadow-[0_1px_10px_rgba(0,0,0,0.8)]">
        {tagline}
      </p>
      {/* The separator rides on the end of the item before it, never the start
          of the next one — otherwise a wrapped line opens with a stray dot. */}
      <p className="flex flex-wrap items-center gap-x-4 gap-y-2 font-serif italic text-[1.3rem] text-ink-soft drop-shadow-[0_1px_10px_rgba(0,0,0,0.8)]">
        {specialities.map((item, i) => (
          <span key={item} className="flex items-center gap-4">
            {item}
            {i < specialities.length - 1 ? (
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber/50" />
            ) : null}
          </span>
        ))}
      </p>
    </div>
  );
}
