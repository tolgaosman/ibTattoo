import fs from "fs/promises";
import path from "path";
import type { Tattoo } from "@/lib/tattoos";
import { revalidatePath } from "next/cache";

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

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
  const data = await fs.readFile(CONTENT_PATH, "utf-8");
  return JSON.parse(data) as SiteContent;
}

export async function saveContent(content: SiteContent): Promise<void> {
  await fs.writeFile(CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");
  revalidatePath("/");
  revalidatePath("/galeri");
  revalidatePath("/admin");
}

export async function updateAbout(about: string[]) {
  const content = await getContent();
  content.about = about;
  await saveContent(content);
}

export async function updateProcess(process: { no: string; title: string; text: string }[]) {
  const content = await getContent();
  content.process = process;
  await saveContent(content);
}

export async function updateBoardSelection(boardSelection: string[]) {
  const content = await getContent();
  content.boardSelection = boardSelection;
  await saveContent(content);
}

export async function updateContact(contact: SiteContent["contact"]) {
  const content = await getContent();
  content.contact = contact;
  await saveContent(content);
}

// Gallery CRUD
export async function addTattoo(tattoo: Tattoo) {
  const content = await getContent();
  content.gallery.push(tattoo);
  await saveContent(content);
}

export async function updateTattoo(id: string, updated: Partial<Tattoo>) {
  const content = await getContent();
  content.gallery = content.gallery.map((t) => (t.id === id ? { ...t, ...updated } : t));
  await saveContent(content);
}

export async function deleteTattoo(id: string) {
  const content = await getContent();
  content.gallery = content.gallery.filter((t) => t.id !== id);
  // Remove from board selection if present
  content.boardSelection = content.boardSelection.filter((tid) => tid !== id);
  await saveContent(content);
}
