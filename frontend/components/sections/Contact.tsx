import { Eyebrow } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { AppointmentForm } from "@/components/contact/AppointmentForm";

/**
 * The closing section, and the quietest one — it leaves the board behind and
 * returns to plain paper, the way the reference drops its texture here too.
 * Three bordered contact boxes on the left, the request form on the right.
 */
const CHANNELS = [
  {
    label: "E-posta",
    value: "merhaba@irmakbozkurt.tattoo",
    href: "mailto:merhaba@irmakbozkurt.tattoo",
    external: false,
    icon: (
      <>
        <rect x="2" y="4" width="16" height="12" rx="1" />
        <path d="m2.5 5 7.5 6 7.5-6" />
      </>
    ),
  },
  {
    label: "Instagram",
    value: "@irmakbozkurt.tattoo",
    href: "https://instagram.com/irmakbozkurt.tattoo",
    external: true,
    icon: (
      <>
        <rect x="3" y="3" width="14" height="14" rx="4" />
        <circle cx="10" cy="10" r="3.4" />
        <circle cx="14.4" cy="5.6" r="0.6" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "Stüdyo",
    value: "Karaköy, İstanbul · Salı – Cumartesi",
    href: null,
    external: false,
    icon: (
      <>
        <path d="M10 17.5s6-4.9 6-9.2A6 6 0 0 0 4 8.3c0 4.3 6 9.2 6 9.2Z" />
        <circle cx="10" cy="8.2" r="2.2" />
      </>
    ),
  },
] as const;

export function Contact() {
  return (
    <section id="iletisim" className="bg-paper px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-16 flex max-w-2xl flex-col gap-5 sm:mb-20">
          <Eyebrow>İletişim</Eyebrow>
          <h2 className="font-serif text-[clamp(2.25rem,7vw,5rem)] leading-[0.95] tracking-[-0.02em] text-ink">
            Kalıcı bir şey
            <br />
            yapalım.
          </h2>
          <p className="max-w-md leading-relaxed text-ink/75">
            Talebini gönderdikten sonra fikrin konuşulur, uygun bir tarih planlanır ve tasarım
            seansta birlikte netleştirilir. Genelde 2–3 iş günü içinde dönüş yapılıyor.
          </p>
        </Reveal>

        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div className="flex min-w-0 flex-col gap-4">
            {CHANNELS.map((channel, i) => (
              <Reveal key={channel.label} delay={i * 80}>
                <Channel {...channel} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="min-w-0">
            <AppointmentForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Channel({
  label,
  value,
  href,
  external,
  icon,
}: {
  label: string;
  value: string;
  href: string | null;
  external: boolean;
  icon: React.ReactNode;
}) {
  const body = (
    <>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8 shrink-0 text-amber"
      >
        {icon}
      </svg>
      <span className="flex min-w-0 flex-col gap-1">
        <Eyebrow>{label}</Eyebrow>
        <span className="truncate text-ink">{value}</span>
      </span>
    </>
  );

  const className =
    "flex items-center gap-5 border border-sand p-5 transition-colors duration-200 ease-out";

  if (!href) {
    return <div className={className}>{body}</div>;
  }

  return (
    <a
      href={href}
      data-cursor="view"
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className={`${className} hover:border-amber`}
    >
      {body}
    </a>
  );
}
