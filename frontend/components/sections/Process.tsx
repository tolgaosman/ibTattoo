import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

interface Step {
  no: string;
  title: string;
  text: string;
}

export function Process({ process }: { process: Step[] }) {
  return (
    <section
      id="surec"
      className="bg-notebook relative isolate overflow-hidden px-5 py-16 sm:px-10 sm:py-32"
    >
      <div className="relative mx-auto max-w-[90rem] pl-6 sm:pl-12 lg:pl-16">
        <Reveal className="mb-10 flex max-w-xl flex-col gap-3 sm:mb-24 sm:gap-5">
          <SectionHeading eyebrow="Nasıl Çalışıyorum?" title="Fikirden Deriye." />
          <p className="font-hand text-lg leading-[26px] sm:text-2xl sm:leading-[32px] text-ink-soft/80">
            Dövme yaptırmak sadece bir sonuç değil, birlikte yürüdüğümüz bir süreç.
          </p>
        </Reveal>

        <div className="grid gap-x-12 gap-y-8 sm:gap-y-16 sm:grid-cols-2 lg:grid-cols-5">
          {process.map((step, i) => (
            <Reveal
              key={step.no}
              delay={i * 80}
              className="relative"
            >
              <article className="flex flex-col">
                <span className="font-hand text-xl sm:text-3xl font-bold text-amber mb-1 sm:mb-2 tracking-widest">{step.no}</span>
                <h3 className="font-hand text-xl leading-[26px] sm:text-3xl sm:leading-[32px] text-ink mb-1">
                  {step.title}
                </h3>
                <p className="font-hand text-lg leading-[26px] sm:text-2xl sm:leading-[32px] text-ink-soft/80">
                  {step.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
