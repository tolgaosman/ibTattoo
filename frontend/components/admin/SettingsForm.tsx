"use client";

import { useState } from "react";
import { saveContactAction } from "@/app/admin/actions";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function SettingsForm({ initialContact }: { initialContact: any }) {
  const [contact, setContact] = useState(initialContact);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveContactAction(contact);
      toast.success("Kişisel bilgiler başarıyla kaydedildi.");
    } catch (err) {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="soft-card p-6 max-w-2xl">
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm text-ink mb-1">E-posta Adresi</label>
          <input
            type="email"
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            className="w-full rounded-md border border-hairline bg-parchment px-3 py-2 text-ink focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink mb-1">Telefon Numarası (Sadece Rakamlar, Örn: 905331234567)</label>
            <input
              type="text"
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              className="w-full rounded-md border border-hairline bg-parchment px-3 py-2 text-ink focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
            />
          </div>
          <div>
            <label className="block text-sm text-ink mb-1">Telefon (Görünecek Metin, Örn: +90 533 123 45 67)</label>
            <input
              type="text"
              value={contact.phoneDisplay}
              onChange={(e) => setContact({ ...contact, phoneDisplay: e.target.value })}
              className="w-full rounded-md border border-hairline bg-parchment px-3 py-2 text-ink focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink mb-1">Instagram Kullanıcı Adı</label>
            <input
              type="text"
              value={contact.instagram}
              onChange={(e) => setContact({ ...contact, instagram: e.target.value })}
              className="w-full rounded-md border border-hairline bg-parchment px-3 py-2 text-ink focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
            />
          </div>
          <div>
            <label className="block text-sm text-ink mb-1">Instagram URL</label>
            <input
              type="url"
              value={contact.instagramUrl}
              onChange={(e) => setContact({ ...contact, instagramUrl: e.target.value })}
              className="w-full rounded-md border border-hairline bg-parchment px-3 py-2 text-ink focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="soft-card--link flex w-full sm:w-auto items-center justify-center rounded-md bg-amber px-6 py-2 text-sm font-medium text-paper-deep disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Değişiklikleri Kaydet"}
        </button>
      </form>
    </div>
  );
}
