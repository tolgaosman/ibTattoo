"use server";

import {
  updateAbout,
  updateHero,
  updateProcess,
  updateBoardSelection,
  updateContact,
  addTattoo,
  updateTattoo,
  deleteTattoo,
  type SiteContent,
} from "@/lib/db";
import type { Tattoo } from "@/lib/tattoos";
import { adminFetch } from "@/lib/api";
import type { AppointmentStatus } from "@/lib/appointments";
import { revalidatePath } from "next/cache";

export async function saveHeroAction(hero: SiteContent["hero"]) {
  await updateHero(hero);
}

export async function saveAboutAction(about: string[], aboutImage?: string) {
  await updateAbout(about, aboutImage);
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

  const { url } = await adminFetch<{ url: string }>("/uploads", {
    method: "POST",
    body: formData,
  });

  return url;
}

export async function updateAppointmentStatusAction(id: number, status: AppointmentStatus) {
  await adminFetch(`/appointments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  revalidatePath("/admin/messages");
}

export async function deleteAppointmentAction(id: number) {
  await adminFetch(`/appointments/${id}`, { method: "DELETE" });
  revalidatePath("/admin/messages");
}
