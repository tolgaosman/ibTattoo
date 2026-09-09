import type { Tattoo } from "@/lib/tattoos";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { apiFetch, adminFetch } from "@/lib/api";
import seedContent from "@/data/content.json";

export interface SiteContent {
  hero: {
    title: string;
    tagline: string;
    specialities: string[];
  };
  about: string[];
  aboutImage: string;
  process: { no: string; title: string; text: string }[];
  gallery: Tattoo[];
  boardSelection: string[];
  contact: {
    email: string;
    phone: string;
    phoneDisplay: string;
    instagram: string;
    instagramUrl: string;
  };
}

/**
 * Last-resort content, bundled into the build. `data/content.json` is the
 * original seed and predates the editable hero and about-image, so those two
 * mirror the backend's own defaults (backend ContentController). Its gallery
 * points at images in `public/images/work/`, so the site still renders in full
 * with the API completely unreachable.
 *
 * The cast is needed because TypeScript widens the JSON's `size`/`aspect`
 * strings, which `Tattoo` declares as unions.
 */
const FALLBACK_CONTENT: SiteContent = {
  ...(seedContent as unknown as Omit<SiteContent, "hero" | "aboutImage">),
  hero: {
    title: "Irmak Bozkurt - tatt2me",
    tagline: "iğne nereye giderse gitsin, kalbim hep Lefke'de kalır",
    specialities: ["İnce çizgi", "Neo-traditional", "Geometrik nokta", "Lefke, KKTC"],
  },
  aboutImage: "/images/hakkimda/portre.jpg",
};

/**
 * `cache()` dedupes this per request — the layout, its metadata and the page
 * each ask for content, and without it that was three API round trips per view.
 */
export const getContent = cache(async (): Promise<SiteContent> => {
  return apiFetch<SiteContent>("/content", { cache: "no-store" });
});

/**
 * The public site's entry point. A visitor should never meet a 500 because the
 * API is down, so failures degrade to the bundled content above.
 *
 * Deliberately NOT used by the admin panel: there, seed content silently
 * standing in for real content would be misleading, so those pages keep the
 * throwing `getContent()` and surface the error.
 */
export async function getPublicContent(): Promise<SiteContent> {
  try {
    return await getContent();
  } catch (error) {
    // `cache: "no-store"` makes Next signal dynamic rendering by throwing, and
    // swallowing that would let a page be prerendered with the fallback baked
    // in permanently. Let Next's own control-flow errors through first.
    unstable_rethrow(error);

    console.error("[content] API unreachable — serving bundled fallback:", error);
    return FALLBACK_CONTENT;
  }
}

function revalidateSite() {
  revalidatePath("/", "layout");
}

export async function updateHero(hero: SiteContent["hero"]) {
  await adminFetch("/content/hero", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hero),
  });
  revalidateSite();
}

export async function updateAbout(about: string[], aboutImage?: string) {
  await adminFetch("/content/about", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(aboutImage !== undefined ? { about, aboutImage } : { about }),
  });
  revalidateSite();
}

export async function updateProcess(process: { no: string; title: string; text: string }[]) {
  await adminFetch("/content/process", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ process }),
  });
  revalidateSite();
}

export async function updateBoardSelection(boardSelection: string[]) {
  await adminFetch("/content/board-selection", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ boardSelection }),
  });
  revalidateSite();
}

export async function updateContact(contact: SiteContent["contact"]) {
  await adminFetch("/content/contact", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
  revalidateSite();
}

// Gallery CRUD
export async function addTattoo(tattoo: Tattoo) {
  await adminFetch("/tattoos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tattoo),
  });
  revalidateSite();
}

export async function updateTattoo(id: string, updated: Partial<Tattoo>) {
  await adminFetch(`/tattoos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });
  revalidateSite();
}

export async function deleteTattoo(id: string) {
  await adminFetch(`/tattoos/${id}`, { method: "DELETE" });
  revalidateSite();
}
