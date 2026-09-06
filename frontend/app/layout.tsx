import type { Metadata, Viewport } from "next";
import { Caveat, Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { Chrome } from "@/components/chrome/Chrome";
import "./globals.css";

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

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "latin-ext"],
});

// Handwriting for the pinned notes and polaroid captions. latin-ext carries the
// Turkish glyphs (ğ, ş, ı, İ), which most script faces drop.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://irmakbozkurt.tattoo"),
  title: {
    default: "Irmak Bozkurt — Derideki Hikayeler",
    template: "%s — Irmak Bozkurt",
  },
  description:
    "İstanbul merkezli dövme sanatçısı Irmak Bozkurt. İnce çizgi, neo-traditional ve geometrik nokta çalışmaları.",
  openGraph: {
    title: "Irmak Bozkurt — Derideki Hikayeler",
    description:
      "İstanbul merkezli dövme sanatçısı Irmak Bozkurt. İnce çizgi, neo-traditional ve geometrik nokta çalışmaları.",
    locale: "tr_TR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4efe6",
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
  address: {
    "@type": "PostalAddress",
    addressLocality: "İstanbul",
    addressCountry: "TR",
  },
  url: "https://irmakbozkurt.tattoo",
  sameAs: ["https://instagram.com/irmakbozkurt.tattoo"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      data-scroll-behavior="smooth"
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable} ${caveat.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink antialiased">
        <a href="#icerik" className="skip-link">
          İçeriğe geç
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
