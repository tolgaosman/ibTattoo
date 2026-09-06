"use server";

import {
  updateAbout,
  updateProcess,
  updateBoardSelection,
  updateContact,
  addTattoo,
  updateTattoo,
  deleteTattoo,
} from "@/lib/db";
import type { Tattoo } from "@/lib/tattoos";
import fs from "fs/promises";
import path from "path";

export async function saveAboutAction(about: string[]) {
  await updateAbout(about);
}

export async function saveProcessAction(process: { no: string; title: string; text: string }[]) {
  await updateProcess(process);
}

export async function saveBoardSelectionAction(selection: string[]) {
  await updateBoardSelection(selection);
}

export async function saveContactAction(contact: any) {
  await updateContact(contact);
}

export async function addTattooAction(tattoo: Tattoo) {
  await addTattoo(tattoo);
}

export async function updateTattooAction(id: string, tattoo: Partial<Tattoo>) {
  await updateTattoo(id, tattoo);
}

export async function deleteTattooAction(id: string) {
  await deleteTattoo(id);
}

export async function uploadImageAction(formData: FormData): Promise<string> {
  const file = formData.get("file") as File;
  if (!file) throw new Error("Dosya bulunamadı");

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const ext = path.extname(file.name) || ".jpg";
  const name = path.basename(file.name, ext).replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const filename = `${name}-${Date.now()}${ext}`;
  
  // ensure directory exists
  const uploadDir = path.join(process.cwd(), "public", "images", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);

  return `/images/uploads/${filename}`;
}
