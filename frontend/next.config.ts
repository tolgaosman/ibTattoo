import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";
const basePath = "/ibTattoo";

// The Laravel API serves gallery images from storage/ — allow next/image to
// optimize them in dev and whatever host API_URL points to in production.
let apiImageHost: URL | undefined;
try {
  apiImageHost = new URL(process.env.API_URL || "http://127.0.0.1:8000/api");
} catch {
  apiImageHost = undefined;
}

const remotePatterns = apiImageHost
  ? [
      {
        protocol: apiImageHost.protocol.replace(":", "") as "http" | "https",
        hostname: apiImageHost.hostname,
        port: apiImageHost.port,
        pathname: "/storage/**",
      },
    ]
  : [];

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
    // API_URL is our own fixed server config, not user input, so allowing a
    // private/loopback host (127.0.0.1 in dev, or the same-VPS backend in
    // production) carries none of the SSRF risk this flag guards against.
    dangerouslyAllowLocalIP: true,
  },
  ...(isStaticExport
    ? {
        output: "export",
        basePath,
        assetPrefix: basePath,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
