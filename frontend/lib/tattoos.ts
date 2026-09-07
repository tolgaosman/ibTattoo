export type TattooStyle =
  | "ince-cizgi"
  | "neo-traditional"
  | "geometrik"
  | "dotwork"
  | "blackwork";

export type TattooSize = "kucuk" | "orta" | "buyuk";

export interface Tattoo {
  id: string;
  slug: string;
  title: string;
  style: TattooStyle;
  size: TattooSize;
  date: string; // ISO
  placement: string;
  duration: string;
  story: string;
  /** Aspect ratio used to build the asymmetric grid. */
  aspect: "portrait" | "square" | "landscape";
  /** Absolute URL, served by the Laravel API's storage disk. */
  image: string;
  /** Photographer credit, required by the source license's spirit even where not mandatory. */
  credit: string;
}

export const STYLE_LABELS: Record<TattooStyle, string> = {
  "ince-cizgi": "Süper İnce Çizgiler",
  "neo-traditional": "Neo-Traditional Portreler",
  geometrik: "Geometrik Nokta Çalışması",
  dotwork: "Dotwork",
  blackwork: "Blackwork",
};

export const SIZE_LABELS: Record<TattooSize, string> = {
  kucuk: "Küçük",
  orta: "Orta",
  buyuk: "Büyük",
};

