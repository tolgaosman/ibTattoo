import { Eyebrow } from "@/components/ui/Label";

export function Footer() {
  return (
    <footer className="border-t border-sand px-6 py-12 sm:px-10">
      <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <span className="font-serif text-2xl text-ink">Irmak Bozkurt</span>
          <Eyebrow>İstanbul, Türkiye</Eyebrow>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <a
            href="mailto:merhaba@irmakbozkurt.tattoo"
            data-cursor="view"
            className="font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors duration-200 ease-out hover:text-amber"
          >
            merhaba@irmakbozkurt.tattoo
          </a>
          <a
            href="https://instagram.com/irmakbozkurt.tattoo"
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="view"
            className="font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors duration-200 ease-out hover:text-amber"
          >
            @irmakbozkurt.tattoo
          </a>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-2 border-t border-sand pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Eyebrow>© {new Date().getFullYear()} Irmak Bozkurt. Tüm hakları saklıdır.</Eyebrow>
        <nav className="flex gap-6" aria-label="Alt bilgi navigasyonu">
          <a
            href="#pano"
            data-cursor="view"
            className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted transition-colors duration-200 ease-out hover:text-amber"
          >
            Pano
          </a>
          <a
            href="#surec"
            data-cursor="view"
            className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted transition-colors duration-200 ease-out hover:text-amber"
          >
            Süreç
          </a>
          <a
            href="#iletisim"
            data-cursor="view"
            className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted transition-colors duration-200 ease-out hover:text-amber"
          >
            Randevu
          </a>
        </nav>
      </div>
    </footer>
  );
}
