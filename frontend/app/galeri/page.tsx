import { getPublicContent } from "@/lib/db";
import { GalleryClient } from "./GalleryClient";

export const revalidate = 0;

export default async function GalleryPage() {
  const content = await getPublicContent();

  return <GalleryClient tattoos={content.gallery} />;
}
