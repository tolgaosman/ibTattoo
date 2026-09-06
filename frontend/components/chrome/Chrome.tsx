"use client";

import dynamic from "next/dynamic";
import { FloatingCTA } from "./FloatingCTA";
import { Footer } from "./Footer";

// Both read browser-only state (sessionStorage / matchMedia) before their
// first paint — mounting them client-only avoids any hydration mismatch.
const Loader = dynamic(() => import("./Loader").then((m) => m.Loader), { ssr: false });
const Cursor = dynamic(() => import("./Cursor").then((m) => m.Cursor), { ssr: false });

export function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Loader />
      <Cursor />
      <FloatingCTA />
      <main id="icerik" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
