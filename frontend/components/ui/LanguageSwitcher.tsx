"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useOverlayHidden } from "@/components/ui/OverlayVisibility";
import { Button } from "@/components/ui/Button";

const LANGUAGES = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const overlayHidden = useOverlayHidden();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Admin and API paths don't use i18n routing
  if (typeof window !== 'undefined' && window.location.pathname.startsWith("/admin") || overlayHidden) return null;

  function choose(nextLocale: "tr" | "en") {
    setOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div ref={rootRef} className="fixed bottom-6 right-24 z-50 sm:bottom-8 sm:right-28">
      {open && (
        <div className="absolute bottom-14 right-0 flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--hairline)] bg-parchment shadow-xl">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              disabled={isPending}
              onClick={() => choose(l.code)}
              className={`px-4 py-2 text-left text-sm whitespace-nowrap transition-colors hover:bg-white/5 ${
                locale === l.code ? "font-semibold text-ink" : "text-ink/70"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
      <Button
        type="button"
        intent="neon"
        size="sm"
        disabled={isPending}
        onClick={() => setOpen((o) => !o)}
        aria-label="Dil seçin / Select language"
        aria-expanded={open}
      >
        {locale.toUpperCase()}
      </Button>
    </div>
  );
}
