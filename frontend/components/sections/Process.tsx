import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Five cards pinned down the left margin, each still held by a pushpin — the
 * handmade part of the language stays. What went was the drafting-table part:
 * the zero-padded monospace counters, the square corners and the hard 1px rail.
 * The steps are numbered in words now, which is how you'd say them out loud.
 */
interface Step {
  no: string;
  title: string;
  text: string;
}

const STEPS: readonly Step[] = [
  {
    no: "1",
    title: "Fikrini Paylaş",
    text: "Formu doldur ya da doğrudan yaz. Ne düşündüğünü, nereye ve neden istediğini anlat — referans görsel şart değil.",
  },
  {
    no: "2",
    title: "Kağıda Eskiz",
    text: "Fikri kendi diline çeviriyorum. İlk eskiz elde, kağıt üzerinde çıkar; dijitale ancak ölçü ve yerleşim netleşince geçiyoruz.",
  },
  {
    no: "3",
    title: "Birlikte Netleştir",
    text: "Eskizi beraber gözden geçiriyoruz. Çizgi kalınlığı, boyut, açı — deriye geçmeden önce her şey burada kararını buluyor.",
  },
  {
    no: "4",
    title: "Dövme Seansı",
    text: "Stüdyoda, tek kişilik bir gün. Küçük işler tek seansta biter; geniş kapsamlı çalışmalar birkaç güne yayılır.",
  },
  {
    no: "5",
    title: "İyileşme ve Bakım",
    text: "İlk iki hafta işin bir parçası. Yazılı bir bakım rehberi veriyorum ve iyileşme boyunca ulaşılabilir kalıyorum.",
  },
];

export function Process() {
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
          {STEPS.map((step, i) => (
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
