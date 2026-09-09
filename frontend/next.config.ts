import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const isStaticExport = process.env.STATIC_EXPORT === "true";
const basePath = "/ibTattoo";

// Where the Laravel side lives. Read at config-eval time, which with
// `output: "standalone"` means BUILD time — the resolved config is serialized
// into the generated server.js and never re-read at runtime. That is why
// docker-compose passes API_URL as a build arg as well as a runtime env var.
let apiHostUrl: URL | undefined;
try {
  apiHostUrl = new URL(process.env.API_URL || "http://127.0.0.1:8000/api");
} catch {
  apiHostUrl = undefined;
}

const storageOrigin = apiHostUrl
  ? `${apiHostUrl.protocol}//${apiHostUrl.host}`
  : "http://127.0.0.1:8000";

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  `img-src 'self' data: blob: ${storageOrigin}`,
  `connect-src 'self' ${storageOrigin}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  experimental: {
    // Admin uploads travel as base64 JSON through a server action, which
    // inflates the payload ~33% over the 8 MB image cap the API enforces.
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },

  // Uploaded images are stored as relative `/storage/...` paths. In production
  // nginx intercepts that prefix and serves the file straight off the shared
  // volume, so this rewrite never runs for a browser request. It IS load
  // bearing for next/image: given a relative src, the optimizer re-enters the
  // router in-process, and that internal request resolves through rewrites.
  // Without it the optimizer finds no such file under public/ and 404s.
  //
  // No `images.remotePatterns` here on purpose: patterns are only consulted for
  // absolute URLs, and every stored path is relative now.
  ...(isStaticExport
    ? {}
    : {
        async rewrites() {
          return [
            {
              source: "/storage/:path*",
              destination: `${storageOrigin}/storage/:path*`,
            },
          ];
        },

        // Static export (next export) can't serve custom headers — the host
        // (e.g. GitHub Pages) would just ignore them — so this only applies
        // to the standalone server build.
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Frame-Options", value: "DENY" },
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                {
                  key: "Permissions-Policy",
                  value: "camera=(), microphone=(), geolocation=()",
                },
                { key: "Content-Security-Policy", value: csp },
              ],
            },
          ];
        },
      }),

  ...(isStaticExport
    ? {
        output: "export",
        basePath,
        assetPrefix: basePath,
        images: { unoptimized: true },
      }
    : {}),
};

export default withNextIntl(nextConfig);
