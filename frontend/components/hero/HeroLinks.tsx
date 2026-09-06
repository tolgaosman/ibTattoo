import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/Button";

/**
 * The site has no navbar, so these are the only way into the sections from the
 * top. They are plain soft pills from the shared button system now — the
 * registration brackets and crooked tags that used to be here were the last of
 * the drafting-table language in the hero.
 *
 * The entrance is a pure CSS cascade (`.hero-rise`), so no client JS is needed
 * just to stagger a fade — this stays a server component.
 */
const LINKS = [
  { href: "#hakkimda", label: "Hakkımda" },
  { href: "#pano", label: "Pano" },
  { href: "/galeri", label: "Galeri" },
  { href: "#surec", label: "Süreç" },
] as const;

const START_DELAY_MS = 1900;
const STEP_MS = 110;

export function HeroLinks() {
  return (
    <div className="flex w-full flex-wrap items-center gap-3">
      {LINKS.map((link, i) => (
        <ButtonLink
          key={link.href}
          href={link.href}
          intent="neon"
          size="sm"
          className="hero-rise"
          style={{ animationDelay: `${START_DELAY_MS + i * STEP_MS}ms` } as CSSProperties}
        >
          {link.label}
        </ButtonLink>
      ))}

      <ButtonLink
        href="#iletisim"
        intent="neon"
        size="sm"
        data-cursor="book"
        className="hero-rise"
        style={{ animationDelay: `${START_DELAY_MS + LINKS.length * STEP_MS}ms` } as CSSProperties}
      >
        Randevu al
      </ButtonLink>
    </div>
  );
}
