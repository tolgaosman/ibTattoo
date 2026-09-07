"use client";

import { useRef, useState } from "react";
import { saveHeroAction, saveAboutAction, saveProcessAction, saveBoardSelectionAction, uploadImageAction } from "@/app/admin/actions";
import { Loader2 } from "lucide-react";

export function DashboardForms({
  initialHero,
  initialAbout,
  initialAboutImage,
  initialProcess,
  initialBoardSelection,
  galleryItems,
}: {
  initialHero: { title: string; tagline: string; specialities: string[] };
  initialAbout: string[];
  initialAboutImage: string;
  initialProcess: any[];
  initialBoardSelection: string[];
  galleryItems: any[];
}) {
  const [hero, setHero] = useState(initialHero);
  const [heroSpecialitiesStr, setHeroSpecialitiesStr] = useState(initialHero.specialities.join(", "));
  const [about, setAbout] = useState(initialAbout);
  const [aboutImage, setAboutImage] = useState(initialAboutImage);
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);
  const [process, setProcess] = useState(initialProcess);
  const [boardSlots, setBoardSlots] = useState<string[]>(() => {
    const slots = [...initialBoardSelection.slice(0, 9)];
    while (slots.length < 9) slots.push("");
    return slots;
  });
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const filledCount = boardSlots.filter(Boolean).length;
  const selectedSlotIndex = (id: string) => boardSlots.indexOf(id);

  const SLOT_LABELS = [
    "Sol Üst",
    "Orta Üst",
    "Sağ Üst",
    "Sol Orta",
    "Orta",
    "Sağ Orta",
    "Sol Alt",
    "Orta Alt",
    "Sağ Alt",
  ];

  const handleSaveHero = async () => {
    setLoading(true);
    await saveHeroAction({
      ...hero,
      specialities: heroSpecialitiesStr.split(",").map(s => s.trim()).filter(Boolean)
    });
    setLoading(false);
    alert("Hero kaydedildi");
  };

  const handleSaveAbout = async () => {
    setLoading(true);
    await saveAboutAction(about, aboutImage);
    setLoading(false);
    alert("Hakkımda kaydedildi");
  };

  const handleAboutImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingAboutImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = await uploadImageAction(formData);
      setAboutImage(url);
    } catch (err) {
      console.error(err);
      alert("Görsel yüklenirken hata oluştu.");
    } finally {
      setUploadingAboutImage(false);
    }
  };

  const handleSaveProcess = async () => {
    setLoading(true);
    await saveProcessAction(process);
    setLoading(false);
    alert("Süreç kaydedildi");
  };

  const handleSaveBoard = async () => {
    setLoading(true);
    await saveBoardSelectionAction(boardSlots.filter(Boolean));
    setLoading(false);
    alert("Pano kaydedildi");
  };

  const clearSlot = (index: number) => {
    const next = [...boardSlots];
    next[index] = "";
    setBoardSlots(next);
    setActiveSlot(index);
  };

  const assignToSlot = (id: string, index: number) => {
    const next = [...boardSlots];
    // remove image from any other slot it currently occupies
    const existingIndex = next.indexOf(id);
    if (existingIndex !== -1) next[existingIndex] = "";
    next[index] = id;
    setBoardSlots(next);
    const nextEmpty = next.findIndex((s) => !s);
    setActiveSlot(nextEmpty === -1 ? null : nextEmpty);
  };


  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="soft-card p-6">
        <h2 className="font-serif text-2xl text-ink mb-6">Hero (Karşılama Ekranı) ve Site Adı</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-ink mb-1">Başlık (Site Adı)</label>
            <input
              type="text"
              value={hero.title}
              onChange={(e) => setHero({ ...hero, title: e.target.value })}
              className="w-full rounded-md border border-hairline bg-parchment px-4 py-2 text-ink focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
            />
          </div>
          <div>
            <label className="block text-sm text-ink mb-1">Slogan</label>
            <input
              type="text"
              value={hero.tagline}
              onChange={(e) => setHero({ ...hero, tagline: e.target.value })}
              className="w-full rounded-md border border-hairline bg-parchment px-4 py-2 text-ink focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
            />
          </div>
          <div>
            <label className="block text-sm text-ink mb-1">Uzmanlık Alanları (Virgülle ayırın)</label>
            <input
              type="text"
              value={heroSpecialitiesStr}
              onChange={(e) => setHeroSpecialitiesStr(e.target.value)}
              placeholder="Örn: İnce çizgi, Neo-traditional, Geometrik nokta"
              className="w-full rounded-md border border-hairline bg-parchment px-4 py-2 text-ink focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
            />
          </div>
          <button
            onClick={handleSaveHero}
            disabled={loading}
            className="soft-card--link flex w-full sm:w-auto items-center justify-center rounded-md bg-amber px-6 py-2 text-sm font-medium text-paper-deep disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Kaydet"}
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="soft-card p-6">
        <h2 className="font-serif text-2xl text-ink mb-6">Hakkımda Düzenle</h2>

        <div className="mb-6 flex items-center gap-4">
          <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md border border-hairline bg-parchment">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={aboutImage} alt="Hakkımda görseli" className="h-full w-full object-cover" />
          </div>
          <div>
            <input
              ref={aboutImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAboutImageChange}
            />
            <button
              type="button"
              onClick={() => aboutImageInputRef.current?.click()}
              disabled={uploadingAboutImage}
              className="soft-card--link flex items-center justify-center rounded-md bg-amber px-4 py-2 text-sm font-medium text-paper-deep disabled:opacity-50"
            >
              {uploadingAboutImage ? <Loader2 className="h-4 w-4 animate-spin" /> : "Görseli Değiştir"}
            </button>
            <p className="mt-1 text-xs text-muted">Değişikliği kalıcı yapmak için altındaki Kaydet butonuna basın.</p>
          </div>
        </div>

        <div className="space-y-4">
          {about.map((text, index) => (
            <textarea
              key={index}
              value={text}
              onChange={(e) => {
                const newAbout = [...about];
                newAbout[index] = e.target.value;
                setAbout(newAbout);
              }}
              className="w-full h-32 rounded-md border border-hairline bg-parchment px-4 py-3 text-ink focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
            />
          ))}
          <button
            onClick={handleSaveAbout}
            disabled={loading}
            className="soft-card--link flex w-full sm:w-auto items-center justify-center rounded-md bg-amber px-6 py-2 text-sm font-medium text-paper-deep disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Kaydet"}
          </button>
        </div>
      </div>

      {/* Process Section */}
      <div className="soft-card p-6">
        <h2 className="font-serif text-2xl text-ink mb-6">Süreç Düzenle (Fikirden Deriye)</h2>
        <div className="space-y-6">
          {process.map((step, index) => (
            <div key={index} className="space-y-2 border-b border-hairline pb-4 last:border-0">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={step.no}
                  onChange={(e) => {
                    const newProcess = [...process];
                    newProcess[index].no = e.target.value;
                    setProcess(newProcess);
                  }}
                  className="w-16 rounded-md border border-hairline bg-parchment px-3 py-2 text-ink focus:border-amber focus:outline-none"
                />
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => {
                    const newProcess = [...process];
                    newProcess[index].title = e.target.value;
                    setProcess(newProcess);
                  }}
                  className="flex-1 rounded-md border border-hairline bg-parchment px-3 py-2 text-ink focus:border-amber focus:outline-none"
                />
              </div>
              <textarea
                value={step.text}
                onChange={(e) => {
                  const newProcess = [...process];
                  newProcess[index].text = e.target.value;
                  setProcess(newProcess);
                }}
                className="w-full h-24 rounded-md border border-hairline bg-parchment px-3 py-2 text-ink focus:border-amber focus:outline-none"
              />
            </div>
          ))}
          <button
            onClick={handleSaveProcess}
            disabled={loading}
            className="soft-card--link flex w-full sm:w-auto items-center justify-center rounded-md bg-amber px-6 py-2 text-sm font-medium text-paper-deep disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Kaydet"}
          </button>
        </div>
      </div>

      {/* Board Selection Section */}
      <div className="soft-card p-6">
        <h2 className="font-serif text-2xl text-ink mb-2">Pano Görselleri</h2>
        <p className="text-muted text-sm mb-2">
          Panoda gösterilecek 9 dövmeyi slotlara yerleştirin (Dolu: {filledCount}/9). Her kutu, sitedeki
          panoda sabit bir konuma karşılık gelir — o kutuya koyduğunuz görsel sitede o konumda görünür.
        </p>
        <p className="text-muted text-xs mb-6">
          Bir slota tıklayın, açılan listeden bir görsel seçin. Dolu bir slotun × işaretine tıklamak onu boşaltır.
        </p>

        {/* Slots grid - fixed 3x3, mirrors the site's board layout */}
        <div className="grid grid-cols-3 gap-4 mb-4 max-w-xl">
          {boardSlots.map((slotId, index) => {
            const item = galleryItems.find((g) => g.id === slotId);
            const isActive = activeSlot === index;
            return (
              <div key={index} className="space-y-1">
                <div
                  onClick={() => setActiveSlot(isActive ? null : index)}
                  className={`relative cursor-pointer aspect-square rounded-md overflow-hidden border-2 transition-all ${
                    isActive
                      ? "border-amber ring-2 ring-amber"
                      : item
                      ? "border-amber/60"
                      : "border-dashed border-hairline hover:border-amber/60"
                  }`}
                >
                  <div className="absolute top-1 left-1 z-10 bg-paper-deep/80 text-amber-light text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {index + 1}
                  </div>
                  {item ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearSlot(index);
                        }}
                        className="absolute top-1 right-1 z-10 bg-paper-deep/80 text-ink hover:text-amber-light text-xs rounded-full h-5 w-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-parchment text-muted text-xs">
                      Boş slot
                    </div>
                  )}
                </div>
                <p className="text-center text-xs text-muted">{SLOT_LABELS[index]}</p>
              </div>
            );
          })}
        </div>

        {/* Contextual picker: only appears while a slot is selected */}
        {activeSlot !== null && (
          <div className="mb-6 rounded-md border border-hairline bg-parchment p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-ink">
                Slot {activeSlot + 1} ({SLOT_LABELS[activeSlot]}) için bir görsel seçin:
              </p>
              <button
                type="button"
                onClick={() => setActiveSlot(null)}
                className="text-xs text-muted hover:text-ink"
              >
                Kapat
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {galleryItems.map((item) => {
                const slotIndex = selectedSlotIndex(item.id);
                const isUsedElsewhere = slotIndex !== -1 && slotIndex !== activeSlot;
                return (
                  <div
                    key={item.id}
                    onClick={() => !isUsedElsewhere && assignToSlot(item.id, activeSlot)}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                      slotIndex === activeSlot
                        ? "border-amber"
                        : isUsedElsewhere
                        ? "border-transparent opacity-30 cursor-not-allowed"
                        : "border-transparent opacity-70 hover:opacity-100 cursor-pointer"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    {isUsedElsewhere && (
                      <div className="absolute inset-0 bg-paper-deep/60 flex items-center justify-center text-amber-light text-xs font-bold">
                        Slot {slotIndex + 1}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <button
          onClick={handleSaveBoard}
          disabled={loading || filledCount !== 9}
          className="soft-card--link flex w-full sm:w-auto items-center justify-center rounded-md bg-amber px-6 py-2 text-sm font-medium text-paper-deep disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Panoyu Kaydet"}
        </button>
      </div>
    </div>
  );
}
