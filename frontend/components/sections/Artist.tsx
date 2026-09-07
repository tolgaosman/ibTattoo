import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

export function Artist({ about, image }: { about: string[]; image: string }) {
  return (
    <section id="hakkimda" className="bg-notebook relative px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal className="lg:rotate-[-1.5deg]">
            <figure className="paper-card relative p-3 pb-16">
              <span className="tape absolute left-1/2 top-0 h-7 w-32 -translate-x-1/2 -translate-y-1/2 rotate-[-3deg]" />
              <div className="relative aspect-[4/5] overflow-hidden bg-parchment">
                <Image
                  src={image}
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
              <h2 className="font-hand text-[clamp(3rem,8vw,5.5rem)] leading-[0.92] text-amber drop-shadow-[0_0_8px_rgba(209,140,64,0.3)]">
                Hakkımda
              </h2>
            </Reveal>

            <ul className="flex flex-col gap-8">
              {about.map((point, i) => (
                <Reveal as="li" key={i} delay={i * 90} className="flex gap-4">
                  <span aria-hidden className="mt-3.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber/70" />
                  <p className="max-w-xl font-hand text-2xl leading-[32px] text-ink-soft/90">{point}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
