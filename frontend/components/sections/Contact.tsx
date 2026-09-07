import { Eyebrow } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { AppointmentForm } from "@/components/contact/AppointmentForm";

interface ContactInfo {
  email: string;
  phone: string;
  phoneDisplay: string;
  instagram: string;
  instagramUrl: string;
}

export function Contact({ contact }: { contact: ContactInfo }) {
  const CHANNELS = [
    {
      label: "E-posta",
      value: contact.email,
      href: `mailto:${contact.email}`,
      external: false,
      icon: (
        <>
          <rect x="2" y="4" width="16" height="12" rx="1" />
          <path d="m2.5 5 7.5 6 7.5-6" />
        </>
      ),
    },
    {
      label: "Telefon",
      value: contact.phoneDisplay,
      href: `tel:+${contact.phone}`,
      external: false,
      icon: (
        <path d="M6.5 3h2l1 3.5-1.7 1.2c.7 1.9 2.1 3.3 4 4l1.2-1.7 3.5 1v2c0 1-.8 1.8-1.8 1.7C9.9 14.2 5.8 10.1 5.3 5.3 5.2 4.3 6 3.5 6.5 3z" />
      ),
    },
    {
      label: "Instagram",
      value: contact.instagram,
      href: contact.instagramUrl,
      external: true,
      icon: (
        <>
          <rect x="3" y="3" width="14" height="14" rx="4" />
          <circle cx="10" cy="10" r="3.4" />
          <circle cx="14.4" cy="5.6" r="0.6" fill="currentColor" stroke="none" />
        </>
      ),
    },
  ] as const;

  return (
    <section id="iletisim" className="bg-contact px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto grid min-w-0 max-w-6xl gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div className="flex min-w-0 flex-col">
          <Reveal className="mb-12 flex max-w-xl flex-col gap-5 sm:mb-16">
            <h2 className="font-hand text-[clamp(3rem,8vw,5.5rem)] leading-[0.95] text-amber drop-shadow-[0_0_8px_rgba(209,140,64,0.3)]">
              Kalıcı bir şey yapalım.
            </h2>
            <p className="max-w-md leading-relaxed text-ink/75">
              Talebini gönderdikten sonra fikrin konuşulur, uygun bir tarih planlanır ve tasarım
              seansta birlikte netleştirilir. Genelde 2–3 iş günü içinde dönüş yapılıyor.
            </p>
          </Reveal>

          <div className="flex min-w-0 flex-col gap-4">
            {CHANNELS.map((channel, i) => (
              <Reveal key={channel.label} delay={i * 80}>
                <Channel {...channel} />
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={120} className="min-w-0">
          <AppointmentForm whatsappPhone={contact.phone} />
        </Reveal>
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

  const className = "soft-card flex min-w-0 items-center gap-5 p-5 sm:p-6";

  if (!href) {
    return <div className={className}>{body}</div>;
  }

  return (
    <a
      href={href}
      data-cursor="view"
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className={`${className} soft-card--link`}
    >
      {body}
    </a>
  );
}
