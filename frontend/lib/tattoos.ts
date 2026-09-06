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
  /** Path under /public — temporary stock photography, see README. */
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

export const tattoos: Tattoo[] = [
  {
    id: "01",
    slug: "muzik",
    title: "Müzik",
    style: "ince-cizgi",
    size: "kucuk",
    date: "2026-07-12",
    placement: "Omuz",
    duration: "1 saat",
    story:
      "Tek bir kelime, akıcı ve kesintisiz bir hatla; müşterinin hayatındaki en sabit tutkuya bir gönderme.",
    aspect: "landscape",
    image: "/images/work/muzik-notu.jpg",
    credit: "Unsplash",
  },
  {
    id: "02",
    slug: "portre-calismasi-no1",
    title: "Portre Çalışması No.1",
    style: "neo-traditional",
    size: "buyuk",
    date: "2026-06-02",
    placement: "Ön kol",
    duration: "6 saat, 2 seans",
    story:
      "Kalın kontur ve siyah-beyaz gölgelemeyle klasik bir neo-traditional portre; tören başlığı ve çizgiler tek bir kompozisyonda birleşiyor.",
    aspect: "portrait",
    image: "/images/work/portre-calismasi-no1.jpg",
    credit: "Unsplash",
  },
  {
    id: "03",
    slug: "kirik-geometri",
    title: "Kırık Geometri",
    style: "geometrik",
    size: "orta",
    date: "2026-05-20",
    placement: "Ön kol",
    duration: "4 saat",
    story:
      "Bir ok motifinin geometrik parçalara ayrıştırılmış hali; her segment kendi başına bir sembol taşıyor.",
    aspect: "square",
    image: "/images/work/kirik-geometri.jpg",
    credit: "Unsplash",
  },
  {
    id: "04",
    slug: "nokta-nokta-manzara",
    title: "Nokta Nokta Manzara",
    style: "dotwork",
    size: "orta",
    date: "2026-04-08",
    placement: "Ön kol",
    duration: "3 saat",
    story:
      "Elmas bir çerçeve içinde, tek tek noktalarla örülmüş bir dağ ve ay manzarası; yakından soyut, uzaktan figüratif.",
    aspect: "portrait",
    image: "/images/work/nokta-nokta-manzara.jpg",
    credit: "Unsplash",
  },
  {
    id: "05",
    slug: "ince-bir-soz",
    title: "İnce Bir Söz",
    style: "ince-cizgi",
    size: "kucuk",
    date: "2026-03-15",
    placement: "Ön kol içi",
    duration: "1 saat",
    story: "Günlük bir hatırlatma; tek satırlık bir cümlenin akıcı hatla dövmeye dönüşmüş hali.",
    aspect: "square",
    image: "/images/work/ince-bir-soz.jpg",
    credit: "Unsplash",
  },
  {
    id: "06",
    slug: "golge-oyunu",
    title: "Gölge Oyunu",
    style: "blackwork",
    size: "buyuk",
    date: "2026-02-01",
    placement: "Sırt, boydan boya",
    duration: "12+ saat, çok seanslı",
    story:
      "Yoğun siyah dolgu ile negatif alanın diyaloğu; simetrik bir kompozisyon sırtı ve iki kolu tek bir işe bağlıyor.",
    aspect: "portrait",
    image: "/images/work/golge-oyunu.jpg",
    credit: "Unsplash",
  },
  {
    id: "07",
    slug: "simetrik-yaprak",
    title: "Simetrik Yaprak",
    style: "geometrik",
    size: "orta",
    date: "2026-01-18",
    placement: "Ön kol",
    duration: "3.5 saat",
    story: "Bir kozalak formunun geometrik çizgilerle sadeleştirilmiş, simetrik bir yorumu.",
    aspect: "square",
    image: "/images/work/simetrik-yaprak.jpg",
    credit: "Unsplash",
  },
  {
    id: "08",
    slug: "yildiz-haritasi",
    title: "Yıldız Haritası",
    style: "dotwork",
    size: "buyuk",
    date: "2025-12-10",
    placement: "Ön kol",
    duration: "8 saat, 2 seans",
    story:
      "Ön kolun tamamına yayılan bir takımyıldız çalışması; her nokta, gece göğünün bir koordinatı.",
    aspect: "portrait",
    image: "/images/work/yildiz-haritasi.jpg",
    credit: "Unsplash",
  },
  {
    id: "09",
    slug: "canli-desen",
    title: "Canlı Desen",
    style: "neo-traditional",
    size: "buyuk",
    date: "2025-11-22",
    placement: "Baldır",
    duration: "5 saat",
    story:
      "Neo-traditional dilin doygun renk paletiyle işlenmiş, canlı ve oyuncu bir kompozisyon.",
    aspect: "landscape",
    image: "/images/work/canli-desen.jpg",
    credit: "Unsplash",
  },
];

export function getTattooBySlug(slug: string): Tattoo | undefined {
  return tattoos.find((t) => t.slug === slug);
}
