"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import clsx from "clsx";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The reference's evidence-board: numbered cards pinned across the surface with
 * string running between them. The string is a single SVG in a 0–100 viewBox so
 * its endpoints are the same percentages that place the cards, and it draws
 * itself once the section is on screen.
 *
 * Below lg the scatter becomes a plain vertical stack and the string becomes one
 * straight line down the left margin — the same idea at one column.
 */

interface Step {
  no: string;
  title: string;
  text: string;
  /** left / top / width as percentages of the board, plus the resting tilt. */
  x: string;
  y: string;
  w: string;
  r: string;
}

const STEPS: readonly Step[] = [
  {
    no: "01",
    title: "Fikrini Paylaş",
    text: "Formu doldur ya da doğrudan yaz. Ne düşündüğünü, nereye ve neden istediğini anlat — referans görsel şart değil.",
    x: "56%",
    y: "0%",
    w: "32%",
    r: "-2deg",
  },
  {
    no: "02",
    title: "Kağıda Eskiz",
    text: "Fikri kendi diline çeviriyorum. İlk eskiz elde, kağıt üzerinde çıkar; dijitale ancak ölçü ve yerleşim netleşince geçiyoruz.",
    x: "5%",
    y: "21%",
    w: "31%",
    r: "2.5deg",
  },
  {
    no: "03",
    title: "Birlikte Netleştir",
    text: "Eskizi beraber gözden geçiriyoruz. Çizgi kalınlığı, boyut, açı — deriye geçmeden önce her şey burada kararını buluyor.",
    x: "60%",
    y: "42%",
    w: "32%",
    r: "1.5deg",
  },
  {
    no: "04",
    title: "Dövme Seansı",
    text: "Stüdyoda, tek kişilik bir gün. Küçük işler tek seansta biter; geniş kapsamlı çalışmalar birkaç güne yayılır.",
    x: "12%",
    y: "63%",
    w: "31%",
    r: "-2.5deg",
  },
  {
    no: "05",
    title: "İyileşme ve Bakım",
    text: "İlk iki hafta işin bir parçası. Yazılı bir bakım rehberi veriyorum ve iyileşme boyunca ulaşılabilir kalıyorum.",
    x: "46%",
    y: "84%",
    w: "32%",
    r: "1deg",
  },
];

/** Endpoints match the card centres above; the sag stays inside the gap band. */
const THREADS = [
  "M 72 15 C 64 20, 34 22, 20.5 21",
  "M 20.5 36 C 30 41, 62 43, 76 42",
  "M 76 57 C 65 62, 40 64, 27.5 63",
  "M 27.5 78 C 37 83, 52 85, 62 84",
] as const;

export function Process() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const node = boardRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="surec" className="board-surface px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-16 flex max-w-xl flex-col gap-5 sm:mb-24">
          <SectionHeading eyebrow="Süreç" title="Fikirden Deriye" />
          <p className="leading-relaxed text-ink/75">
            İlk mesajdan iyileşmiş dövmeye kadar beş adım. Aceleye getirilen hiçbir aşama yok —
            kalıcı bir şey yapıyoruz.
          </p>
        </Reveal>

        <div
          ref={boardRef}
          className="relative flex flex-col gap-8 pl-10 lg:block lg:h-[1280px] lg:gap-0 lg:pl-0"
        >
          {/* Mobile: one straight run of string down the margin. */}
          <span
            aria-hidden
            className="absolute bottom-6 left-[18px] top-6 w-px bg-amber/45 lg:hidden"
          />

          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 hidden h-full w-full lg:block"
          >
            {THREADS.map((d, i) => (
              <path
                key={d}
                d={d}
                pathLength={1}
                className="thread thread-draw"
                style={{
                  strokeDasharray: "1",
                  strokeDashoffset: drawn ? "0" : "1",
                  transitionDelay: `${i * 160}ms`,
                }}
              />
            ))}
          </svg>

          {STEPS.map((step, i) => (
            <Reveal
              key={step.no}
              delay={i * 80}
              style={
                {
                  "--x": step.x,
                  "--y": step.y,
                  "--w": step.w,
                  "--r": step.r,
                } as CSSProperties
              }
              className={clsx(
                "relative lg:absolute lg:left-[var(--x)] lg:top-[var(--y)] lg:w-[var(--w)]",
              )}
            >
              <article className="paper-card relative p-6 sm:p-7 lg:rotate-[var(--r)]">
                <span aria-hidden className="pin absolute -top-1.5 left-6" />
                <span className="font-mono text-xs tracking-[0.14em] text-amber">{step.no}</span>
                <h3 className="mt-3 font-serif text-2xl leading-tight tracking-[-0.01em] text-ink sm:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{step.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
