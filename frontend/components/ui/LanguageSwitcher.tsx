"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useOverlayHidden } from "@/components/ui/OverlayVisibility";
import { Button } from "@/components/ui/Button";

type Lang = "tr" | "en";

const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
];

const STORAGE_KEY = "preferredLang";

function applyLanguage(lang: Lang) {
  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!select) return false;
  if (select.value === lang) return true;
  select.value = lang;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

// Retries applying the language until Google Translate's hidden <select> has
// mounted (it loads asynchronously) or the attempt budget runs out.
function applyLanguageWithRetry(lang: Lang, maxAttempts = 40) {
  let attempts = 0;
  const id = window.setInterval(() => {
    attempts += 1;
    if (applyLanguage(lang) || attempts >= maxAttempts) window.clearInterval(id);
  }, 250);
}

export function LanguageSwitcher() {
  const pathname = usePathname();
  const overlayHidden = useOverlayHidden();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("tr");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Lang | null) ?? "tr";
    setLang(stored);
    if (stored !== "tr") applyLanguageWithRetry(stored);
  }, []);

  // Client-side navigation swaps in new DOM that Google hasn't translated
  // yet, and can reset the widget's own selection — reapply after each route
  // change so translation keeps covering newly rendered content.
  useEffect(() => {
    if (lang === "tr") return;
    const id = window.setTimeout(() => applyLanguage(lang), 300);
    return () => window.clearTimeout(id);
  }, [pathname, lang]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (pathname?.startsWith("/admin") || overlayHidden) return null;

  function choose(code: Lang) {
    setOpen(false);
    setLang(code);
    localStorage.setItem(STORAGE_KEY, code);
    applyLanguageWithRetry(code, 20);
  }

  return (
    <div ref={rootRef} className="fixed bottom-6 right-24 z-50 sm:bottom-8 sm:right-28">
      {open && (
        <div className="notranslate absolute bottom-14 right-0 flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--hairline)] bg-parchment shadow-xl">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => choose(l.code)}
              className={`px-4 py-2 text-left text-sm whitespace-nowrap transition-colors hover:bg-white/5 ${
                lang === l.code ? "font-semibold text-ink" : "text-ink/70"
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
        onClick={() => setOpen((o) => !o)}
        aria-label="Dil seçin / Select language"
        aria-expanded={open}
        className="notranslate"
      >
        {lang.toUpperCase()}
      </Button>
    </div>
  );
}
