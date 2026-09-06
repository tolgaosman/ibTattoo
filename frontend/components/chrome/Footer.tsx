import { Eyebrow } from "@/components/ui/Label";

const LINKS = [
  { href: "#pano", label: "Pano" },
  { href: "#surec", label: "Süreç" },
  { href: "#iletisim", label: "Randevu" },
] as const;

const linkClass =
  "text-sm text-muted transition-colors duration-300 ease-out hover:text-amber-light";

export function Footer() {
  return (
    <footer className="px-6 py-14 sm:px-10">
      {/* Soft rules that fade out at both ends — the footer is separated from
          the page by a suggestion, not a ruled line. */}
      <span aria-hidden className="soft-rule mb-12 block" />

      <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="font-script text-4xl leading-tight text-ink">Irmak Bozkurt</span>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <a href="mailto:irmakyamuer2000@gmail.com" data-cursor="view" className={linkClass}>
            irmakyamuer2000@gmail.com
          </a>
          <a
            href="https://www.instagram.com/tatt2.me/"
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="view"
            className={linkClass}
          >
            @tatt2.me
          </a>
        </div>
      </div>

      <span aria-hidden className="soft-rule mt-12 block" />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Eyebrow>© {new Date().getFullYear()} Irmak Bozkurt. Tüm hakları saklıdır.</Eyebrow>
        <nav className="flex gap-6" aria-label="Alt bilgi navigasyonu">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} data-cursor="view" className={linkClass}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
