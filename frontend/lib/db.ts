import type { Tattoo } from "@/lib/tattoos";
import { revalidatePath } from "next/cache";
import { apiFetch, adminFetch } from "@/lib/api";

export interface SiteContent {
  about: string[];
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

export async function getContent(): Promise<SiteContent> {
  return apiFetch<SiteContent>("/content", { cache: "no-store" });
}

function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/galeri");
  revalidatePath("/admin");
}

export async function updateAbout(about: string[]) {
  await adminFetch("/content/about", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ about }),
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
