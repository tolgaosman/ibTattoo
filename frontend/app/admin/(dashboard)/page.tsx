import { DashboardForms } from "@/components/admin/DashboardForms";
import { getContent } from "@/lib/db";

export const revalidate = 0;

export default async function AdminDashboard() {
  const content = await getContent();

  return (
    <div className="space-y-8 hero-rise">
      <div>
        <h1 className="font-serif text-4xl text-amber-light">Ana Sayfa Düzenle</h1>
        <p className="mt-2 text-muted">Sitenin ana sayfasında yer alan içerikleri buradan güncelleyebilirsiniz.</p>
      </div>

      <DashboardForms
        initialAbout={content.about}
        initialAboutImage={content.aboutImage}
        initialProcess={content.process}
        initialBoardSelection={content.boardSelection}
        galleryItems={content.gallery}
      />
    </div>
  );
}
