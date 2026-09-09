import type { Metadata, Viewport } from "next";
import { Caveat, Instrument_Serif, Inter, Parisienne } from "next/font/google";
import { Chrome } from "@/components/chrome/Chrome";
import "../globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

// The neon wordmark, and nothing else. A connected script is what makes a
// bent-glass sign read as one continuous tube instead of separate letters.
// "Irmak Bozkurt" is pure ASCII, so the latin subset covers it.
const parisienne = Parisienne({
  variable: "--font-parisienne",
  subsets: ["latin"],
  weight: "400",
});

// Handwriting for the pinned notes and polaroid captions. latin-ext carries the
// Turkish glyphs (ğ, ş, ı, İ), which most script faces drop.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin", "latin-ext"],
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublicContent();
  const siteTitle = content.hero?.title || "Irmak Bozkurt — Derideki Hikayeler";
  
  return {
    metadataBase: new URL("https://irmakbozkurt.tattoo"),
    title: {
      default: siteTitle,
      template: `%s — ${siteTitle.split(' - ')[0]}`,
    },
    description:
      "Kuzey Kıbrıs dövme sanatçısı Irmak Bozkurt. İnce çizgi, neo-traditional ve geometrik nokta çalışmaları.",
    icons: {
      icon: "/images/siteLogo.png",
      apple: "/images/siteLogo.png",
    },
    openGraph: {
      title: siteTitle,
      description:
        "Kuzey Kıbrıs dövme sanatçısı Irmak Bozkurt. İnce çizgi, neo-traditional ve geometrik nokta çalışmaları.",
      locale: "tr_TR",
      type: "website",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#12100e",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  name: "Irmak Bozkurt Tattoo",
  founder: {
    "@type": "Person",
    name: "Irmak Bozkurt",
    jobTitle: "Dövme Sanatçısı",
  },
  url: "https://irmakbozkurt.tattoo",
  sameAs: ["https://www.instagram.com/tatt2.me/"],
};

import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { OverlayVisibilityProvider } from "@/components/ui/OverlayVisibility";
import { ToastProvider } from "@/components/ui/Toast";
import { getPublicContent } from "@/lib/db";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

export default async function RootLayout({ children, params }: { children: React.ReactNode, params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Set the locale for the current request
  setRequestLocale(locale);
  
  // Provide messages to the client side
  const messages = await getMessages();
  // Admin's phone-number setting doubles as the WhatsApp contact number
  // site-wide. If the API is unreachable this resolves to the bundled
  // fallback's number rather than breaking every page.
  const { contact } = await getPublicContent();
  const phone = contact?.phone;

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${instrumentSerif.variable} ${inter.variable} ${parisienne.variable} ${caveat.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink antialiased">
        <NextIntlClientProvider messages={messages}>
        <a href="#icerik" className="skip-link">
          İçeriğe geç
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ToastProvider>
          <OverlayVisibilityProvider>
            <Chrome>{children}</Chrome>
            <LanguageSwitcher />
            <FloatingWhatsApp phone={phone} />
          </OverlayVisibilityProvider>
        </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
