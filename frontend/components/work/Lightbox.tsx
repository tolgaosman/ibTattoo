"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { Eyebrow } from "@/components/ui/Label";
import { useOverlayHold } from "@/components/ui/OverlayVisibility";
import { SIZE_LABELS, formatStyle, type Tattoo } from "@/lib/tattoos";

interface LightboxProps {
  items: Tattoo[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
}

export function Lightbox({ items, index, onIndexChange }: LightboxProps) {
  const tattoo = index !== null ? items[index] : null;

  useOverlayHold(tattoo !== null);

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
        <Dialog.Popup className="fixed inset-0 z-50 flex flex-col overflow-hidden p-4 transition-[opacity,transform] duration-300 ease-out data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 sm:p-6 lg:overflow-y-auto lg:p-12">
          {tattoo ? (
            <div className="mx-auto flex h-full w-full max-w-5xl flex-col">
              <div className="mb-3 flex shrink-0 items-center justify-between sm:mb-8">
                <Dialog.Title className="truncate font-serif text-lg text-ink sm:text-2xl lg:text-3xl">
                  {tattoo.title}
                </Dialog.Title>
                <Dialog.Close
                  aria-label="Kapat"
                  data-cursor="view"
                  className="shrink-0 pl-4 text-sm text-muted transition-colors duration-300 ease-out hover:text-amber-light"
                >
                  Kapat
                </Dialog.Close>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-4 lg:grid lg:grid-cols-[1.4fr_1fr] lg:gap-8">
                <div className="relative h-[30vh] w-full shrink-0 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--hairline)] bg-parchment shadow-[var(--shadow-lift)] sm:h-[38vh] lg:h-full lg:min-h-[40vh]">
                  <Image
                    src={tattoo.image}
                    alt={`${tattoo.title} — ${formatStyle(tattoo.style)}`}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden sm:gap-4 lg:gap-6">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:flex sm:flex-col sm:gap-4">
                    <MetaRow label="Tarz" value={formatStyle(tattoo.style)} />
                    <MetaRow label="Boyut" value={SIZE_LABELS[tattoo.size]} />
                    <MetaRow label="Bölge" value={tattoo.placement} />
                    <MetaRow label="Süre" value={tattoo.duration} />
                  </div>
                  <div className="min-h-0 flex-1 overflow-hidden">
                    <Eyebrow>Sürece Dair</Eyebrow>
                    <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-ink/90 sm:mt-2 sm:line-clamp-none sm:text-base">
                      {tattoo.story}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex shrink-0 items-center justify-between text-xs text-muted sm:mt-10 sm:text-sm">
                <button
                  type="button"
                  data-cursor="view"
                  onClick={() => onIndexChange((index! - 1 + items.length) % items.length)}
                  className="transition-colors duration-300 ease-out hover:text-amber-light"
                >
                  ← Önceki
                </button>
                <span className="font-serif text-sm italic sm:text-base">
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
    <div className="flex items-baseline justify-between gap-2 border-b border-[var(--hairline)] pb-1 sm:pb-2">
      <Eyebrow>{label}</Eyebrow>
      <span className="truncate font-sans text-sm text-ink">{value}</span>
    </div>
  );
}
