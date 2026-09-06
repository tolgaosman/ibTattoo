import { getContent } from "@/lib/db";
import { GalleryManager } from "@/components/admin/GalleryManager";

export const revalidate = 0;

export default async function AdminPortfolio() {
  const content = await getContent();

  return (
    <div className="space-y-8 hero-rise">
      <div>
        <h1 className="font-serif text-4xl text-amber-light">Galeri Yönetimi</h1>
        <p className="mt-2 text-muted">Dövme galerisine yeni eserler ekleyebilir veya silebilirsiniz.</p>
      </div>

      <GalleryManager initialItems={content.gallery} />
    </div>
  );
}
