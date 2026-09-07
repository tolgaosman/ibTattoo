"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary: this one replaces the root layout, so it has to bring
 * its own <html>/<body>. Styles are inline on purpose — if the failure was in
 * the layout or the stylesheet, class names cannot be relied on here.
 */
export default function GlobalError({
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
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          padding: "2rem 1.5rem",
          textAlign: "center",
          background: "#12100e",
          color: "#f2ece1",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "clamp(1.75rem, 6vw, 2.75rem)", color: "#d18c40" }}>
          Bir şeyler ters gitti
        </h1>

        <p style={{ margin: 0, maxWidth: "34rem", lineHeight: 1.6, color: "#c6bbaa" }}>
          Site şu anda yüklenemedi. Birazdan tekrar denerseniz büyük ihtimalle düzelmiş olacak.
        </p>

        <button
          onClick={reset}
          style={{
            marginTop: "0.5rem",
            border: "none",
            borderRadius: "999px",
            padding: "0.75rem 1.75rem",
            background: "#d18c40",
            color: "#0d0c0a",
            fontSize: "0.9rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Tekrar dene
        </button>

        {error.digest && (
          <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#8b8072" }}>
            Hata kodu: {error.digest}
          </p>
        )}
      </body>
    </html>
  );
}
