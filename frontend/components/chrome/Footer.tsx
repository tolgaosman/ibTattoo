import { Eyebrow } from "@/components/ui/Label";

export function Footer() {
  return (
    <footer className="px-6 py-14 sm:px-10">
      {/* A soft rule that fades out at both ends — the footer is separated
          from the page by a suggestion, not a ruled line. */}
      <span aria-hidden className="soft-rule mb-12 block" />

      <div className="grid gap-3 text-center sm:grid-cols-3 sm:items-center sm:text-left">
        <span className="font-script text-2xl leading-tight text-ink">Irmak Bozkurt - tatt2me</span>
        <Eyebrow className="sm:text-center">
          © {new Date().getFullYear()} Irmak Bozkurt. Tüm hakları saklıdır.
        </Eyebrow>
        <span aria-hidden className="hidden sm:block" />
      </div>
    </footer>
  );
}
