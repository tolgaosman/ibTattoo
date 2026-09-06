import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Label";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <Eyebrow>404</Eyebrow>
      <h1 className="font-serif text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] tracking-[-0.02em] text-ink">
        Bu sayfa dövülmemiş.
      </h1>
      <p className="max-w-md text-ink/80">Aradığın sayfa bulunamadı. Belki de henüz mürekkeple yazılmadı.</p>
      <ButtonLink href="/">Ana Sayfaya Dön</ButtonLink>
    </div>
  );
}
