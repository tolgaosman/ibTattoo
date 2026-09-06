import { getContent } from "@/lib/db";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const revalidate = 0;

export default async function AdminSettings() {
  const content = await getContent();

  return (
    <div className="space-y-8 hero-rise">
      <div>
        <h1 className="font-serif text-4xl text-amber-light">Kişisel Bilgiler</h1>
        <p className="mt-2 text-muted">İletişim bilgilerinizi ve sosyal medya bağlantılarınızı buradan güncelleyebilirsiniz.</p>
      </div>

      <SettingsForm initialContact={content.contact} />
    </div>
  );
}
