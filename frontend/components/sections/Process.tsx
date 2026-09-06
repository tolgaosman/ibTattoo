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
      className="bg-notebook relative isolate overflow-hidden px-6 py-24 sm:px-10 sm:py-32"
    >
      <div className="relative mx-auto max-w-7xl pl-8 sm:pl-12 lg:pl-16">
        <Reveal className="mb-16 flex max-w-xl flex-col gap-5 sm:mb-24">
          <SectionHeading eyebrow="Süreç" title="Fikirden Deriye" />
          <p className="font-hand text-2xl leading-[32px] text-ink-soft/80">
            İlk mesajdan iyileşmiş dövmeye kadar beş adım. Aceleye getirilen hiçbir aşama yok — kalıcı bir şey yapıyoruz.
          </p>
        </Reveal>

        <div className="grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-5">
          {process.map((step, i) => (
            <Reveal
              key={step.no}
              delay={i * 80}
              className="relative"
            >
              <article className="flex flex-col">
                <span className="font-hand text-3xl font-bold text-amber mb-2 tracking-widest">{step.no}</span>
                <h3 className="font-hand text-3xl leading-[32px] text-ink mb-1">
                  {step.title}
                </h3>
                <p className="font-hand text-2xl leading-[32px] text-ink-soft/80">
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
