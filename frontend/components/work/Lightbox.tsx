"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { Eyebrow } from "@/components/ui/Label";
import { SIZE_LABELS, formatStyle, type Tattoo } from "@/lib/tattoos";

interface LightboxProps {
  items: Tattoo[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
}

export function Lightbox({ items, index, onIndexChange }: LightboxProps) {
  const tattoo = index !== null ? items[index] : null;

  useEffect(() => {
    if (index === null || items.length === 0) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") onIndexChange((index + 1) % items.length);
      if (event.key === "ArrowLeft") onIndexChange((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items, onIndexChange]);

  return (
    <Dialog.Root open={tattoo !== null} onOpenChange={(open) => !open && onIndexChange(null)}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-paper/95 transition-opacity duration-300 ease-out data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <Dialog.Popup className="fixed inset-0 z-50 overflow-y-auto p-6 transition-[opacity,transform] duration-300 ease-out data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 sm:p-12">
          {tattoo ? (
            <div className="mx-auto flex min-h-full max-w-5xl flex-col">
              <div className="mb-8 flex items-center justify-between">
                <Dialog.Title className="font-serif text-2xl text-ink sm:text-3xl">
                  {tattoo.title}
                </Dialog.Title>
                <Dialog.Close
                  aria-label="Kapat"
                  data-cursor="view"
                  className="text-sm text-muted transition-colors duration-300 ease-out hover:text-amber-light"
                >
                  Kapat
                </Dialog.Close>
              </div>

              <div className="grid flex-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
                <div className="relative min-h-[40vh] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--hairline)] bg-parchment shadow-[var(--shadow-lift)]">
                  <Image
                    src={tattoo.image}
                    alt={`${tattoo.title} — ${formatStyle(tattoo.style)}`}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-6">
                  <MetaRow label="Tarz" value={formatStyle(tattoo.style)} />
                  <MetaRow label="Boyut" value={SIZE_LABELS[tattoo.size]} />
                  <MetaRow label="Bölge" value={tattoo.placement} />
                  <MetaRow label="Süre" value={tattoo.duration} />
                  <div>
                    <Eyebrow>Sürece Dair</Eyebrow>
                    <p className="mt-2 leading-relaxed text-ink/90">{tattoo.story}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex items-center justify-between text-sm text-muted">
                <button
                  type="button"
                  data-cursor="view"
                  onClick={() => onIndexChange((index! - 1 + items.length) % items.length)}
                  className="transition-colors duration-300 ease-out hover:text-amber-light"
                >
                  ← Önceki
                </button>
                <span className="font-serif text-base italic">
                  {index! + 1} / {items.length}
                </span>
                <button
                  type="button"
                  data-cursor="view"
                  onClick={() => onIndexChange((index! + 1) % items.length)}
                  className="transition-colors duration-300 ease-out hover:text-amber-light"
                >
                  Sonraki →
                </button>
              </div>
            </div>
          ) : null}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-[var(--hairline)] pb-2">
      <Eyebrow>{label}</Eyebrow>
      <span className="font-sans text-sm text-ink">{value}</span>
    </div>
  );
}
