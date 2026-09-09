"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";

/**
 * Route-level error boundary. Public pages fall back to bundled content rather
 * than throwing (see lib/db.ts), so reaching this screen means something less
 * expected broke — but a visitor should still land somewhere warm with a way
 * out, never on the platform's raw 500.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="font-hand text-[clamp(2.5rem,7vw,4rem)] leading-[0.95] text-amber drop-shadow-[0_0_8px_rgba(209,140,64,0.3)]">
        Bir şeyler ters gitti
      </h1>

      <p className="max-w-md leading-relaxed text-ink/75">
        Sayfa yüklenirken beklenmedik bir hata oluştu. Tekrar denemek çoğu zaman yeterli oluyor.
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} intent="primary" size="sm">
          Tekrar dene
        </Button>
        <ButtonLink href="/" intent="ghost" size="sm">
          Ana sayfaya dön
        </ButtonLink>
      </div>

      {error.digest && (
        <p className="mt-4 font-mono text-xs text-muted">Hata kodu: {error.digest}</p>
      )}
    </main>
  );
}
