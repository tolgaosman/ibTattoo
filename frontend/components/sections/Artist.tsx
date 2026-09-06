import Image from "next/image";
import { Eyebrow } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The reference stages this as loose prints laid on the board: a tall portrait
 * on the left, the copy set against it, the artist's name run huge along the
 * bottom edge, and a second wider print tucked into the corner with a note
 * pinned to it. Same composition here, on paper instead of black.
 */
const POINTS = [
  "Dövmeyi geçici bir trend değil, kalıcı bir cümle olarak görüyorum. Her proje; uzun bir dinleme, birkaç taslak ve tek bir doğru çizgiye ulaşana kadar süren bir arınma süreci.",
  "2016'da İstanbul'da çıraklıkla başladım. 2019'da kendi stüdyomu açtım ve ince çizgi çalışmalarına yoğunlaştım; 2022'den beri neo-traditional portre serisiyle konuk sanatçı olarak çalışıyorum.",
  "İnce çizgi, neo-traditional, geometrik nokta çalışması ve blackwork — dört ayrı dil, tek bir el. Karaköy'deki stüdyoda yalnızca bire bir randevularla, sınırlı sayıda proje alıyorum.",
] as const;

export function Artist() {
  return (
    <section id="sanatci" className="board-surface relative px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal className="lg:rotate-[-1.5deg]">
            <figure className="paper-card relative p-3 pb-16">
              <span className="tape absolute left-1/2 top-0 h-7 w-32 -translate-x-1/2 -translate-y-1/2 rotate-[-3deg]" />
              <div className="relative aspect-[4/5] overflow-hidden bg-parchment">
                <Image
                  src="/images/hakkimda/portre.jpg"
                  alt="Stüdyoda dövme çalışması sırasında bir an"
                  fill
                  sizes="(min-width: 1024px) 38vw, 90vw"
                  className="object-cover object-[65%_50%]"
                />
              </div>
              <figcaption className="absolute inset-x-3 bottom-4 text-center font-hand text-2xl leading-none text-ink-soft">
                stüdyoda, bir salı öğleden sonrası
              </figcaption>
            </figure>
          </Reveal>

          <div className="flex flex-col gap-10">
            <Reveal>
              <Eyebrow className="mb-4 block">Sanatçı</Eyebrow>
              <h2 className="font-serif text-[clamp(2.5rem,7vw,5rem)] leading-[0.92] tracking-[-0.02em] text-ink">
                Sanatçıyla
                <br />
                Tanış
              </h2>
            </Reveal>

            <ul className="flex flex-col gap-7">
              {POINTS.map((point, i) => (
                <Reveal as="li" key={i} delay={i * 90} className="flex gap-4">
                  <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-amber" />
                  <p className="max-w-lg leading-relaxed text-ink/85">{point}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 grid items-end gap-16 lg:mt-10 lg:grid-cols-[1fr_0.85fr]">
          <Reveal>
            <h3
              aria-hidden
              className="font-serif text-[clamp(4rem,14vw,11rem)] leading-[0.8] tracking-[-0.03em] text-ink/90"
            >
              Irmak
            </h3>
          </Reveal>

          <Reveal delay={120} className="relative lg:rotate-[1deg]">
            <figure className="paper-card relative p-2.5">
              <span className="tape absolute right-6 top-0 h-6 w-24 -translate-y-1/2 rotate-[4deg]" />
              <div className="relative aspect-[16/10] overflow-hidden bg-parchment">
                <Image
                  src="/images/hero/hero-ref.jpg"
                  alt="Stüdyonun akşam ışığındaki hali"
                  fill
                  sizes="(min-width: 1024px) 34vw, 90vw"
                  className="object-cover"
                />
              </div>
            </figure>

            <div className="absolute -bottom-9 left-2 w-44 rotate-[-4deg] bg-note px-4 py-3 shadow-[0_8px_20px_-12px_rgba(28,24,21,0.5)] sm:-left-8 sm:w-52">
              <span aria-hidden className="pin absolute -top-1.5 left-1/2 -translate-x-1/2" />
              <p className="font-hand text-xl leading-tight text-ink-soft">
                Karaköy, İstanbul — yalnızca randevu ile
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
