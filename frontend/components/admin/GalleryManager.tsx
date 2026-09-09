"use client";

import { useState, useRef } from "react";
import type { Tattoo } from "@/lib/tattoos";
import { addTattooAction, deleteTattooAction, updateTattooAction, uploadImageAction } from "@/app/admin/actions";
import { Loader2, Plus, Trash2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { DatePicker } from "@/components/ui/DatePicker";
import { useToast } from "@/components/ui/Toast";

export function GalleryManager({ initialItems }: { initialItems: Tattoo[] }) {
  const [items, setItems] = useState<Tattoo[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const emptyTattoo: Partial<Tattoo> = {
    style: "",
    size: "orta",
    aspect: "portrait",
    date: new Date().toISOString().split("T")[0],
  };
  const [newTattoo, setNewTattoo] = useState<Partial<Tattoo>>(emptyTattoo);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const scrollToForm = () => {
    setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const startAdd = () => {
    setEditingId(null);
    setNewTattoo(emptyTattoo);
    setUploadFile(null);
    setIsAdding(true);
    scrollToForm();
  };

  const startEdit = (item: Tattoo) => {
    setEditingId(item.id);
    setNewTattoo(item);
    setUploadFile(null);
    setIsAdding(true);
    scrollToForm();
  };

  const cancelForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewTattoo(emptyTattoo);
    setUploadFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu dövmeyi silmek istediğinize emin misiniz?")) return;
    setLoading(true);
    await deleteTattooAction(id);
    setItems(items.filter((i) => i.id !== id));
    setLoading(false);
    router.refresh();
    toast.success("Dövme silindi");
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let imagePath = newTattoo.image || "";

      if (uploadFile) {
        const formData = new FormData();
        formData.append("file", uploadFile);
        imagePath = await uploadImageAction(formData);
      }

      if (!imagePath) {
        toast.error("Lütfen bir resim yükleyin veya resim yolu girin.");
        setLoading(false);
        return;
      }

      if (editingId) {
        const updates: Partial<Tattoo> = {
          slug: newTattoo.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "yeni",
          title: newTattoo.title || "İsimsiz",
          style: newTattoo.style || "",
          size: newTattoo.size as any,
          date: newTattoo.date || "",
          placement: newTattoo.placement || "",
          duration: newTattoo.duration || "",
          story: newTattoo.story || "",
          aspect: newTattoo.aspect as any,
          image: imagePath,
          credit: newTattoo.credit || "Irmak Bozkurt",
        };
        await updateTattooAction(editingId, updates);
        setItems(items.map((i) => (i.id === editingId ? { ...i, ...updates } : i)));
      } else {
        const fullTattoo: Tattoo = {
          id: Date.now().toString(),
          slug: (newTattoo.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "yeni") + "-" + Math.random().toString(36).substring(2, 6),
          title: newTattoo.title || "İsimsiz",
          style: newTattoo.style || "",
          size: newTattoo.size as any,
          date: newTattoo.date || "",
          placement: newTattoo.placement || "",
          duration: newTattoo.duration || "",
          story: newTattoo.story || "",
          aspect: newTattoo.aspect as any,
          image: imagePath,
          credit: newTattoo.credit || "Irmak Bozkurt",
        };
        await addTattooAction(fullTattoo);
        setItems([fullTattoo, ...items]);
      }

      cancelForm();
      router.refresh();
      toast.success(editingId ? "Dövme güncellendi" : "Dövme eklendi");
    } catch (err) {
      console.error(err);
      alert("Hata oluştu: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="flex justify-end">
        <button
          onClick={() => (isAdding ? cancelForm() : startAdd())}
          className="soft-card--link flex items-center gap-2 rounded-md bg-amber px-4 py-2 text-sm font-medium text-paper-deep"
        >
          <Plus className="h-4 w-4" />
          Yeni Ekle
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="soft-card p-6 space-y-4">
          <h2 className="font-serif text-2xl text-amber-light">{editingId ? "Dövmeyi Düzenle" : "Yeni Dövme Ekle"}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-ink mb-1">Başlık *</label>
              <input type="text" required value={newTattoo.title || ""} onChange={e => setNewTattoo({...newTattoo, title: e.target.value})} className="w-full rounded-md border border-hairline bg-parchment px-3 py-2 text-ink focus:border-amber focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-ink mb-1">Stil *</label>
              <input type="text" required value={newTattoo.style || ""} onChange={e => setNewTattoo({...newTattoo, style: e.target.value})} className="w-full rounded-md border border-hairline bg-parchment px-3 py-2 text-ink focus:border-amber focus:outline-none" placeholder="Örn: İnce Çizgi" />
            </div>
            <div>
              <label className="block text-sm text-ink mb-1">Bölge *</label>
              <input type="text" required value={newTattoo.placement || ""} onChange={e => setNewTattoo({...newTattoo, placement: e.target.value})} className="w-full rounded-md border border-hairline bg-parchment px-3 py-2 text-ink focus:border-amber focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-ink mb-1">Tarih *</label>
              <DatePicker
                value={newTattoo.date ? new Date(newTattoo.date) : undefined}
                onChange={date => {
                  if (date) {
                    // Adjust for local timezone offset when creating ISO string
                    const offset = date.getTimezoneOffset() * 60000;
                    const localISOTime = (new Date(date.getTime() - offset)).toISOString().split("T")[0];
                    setNewTattoo({...newTattoo, date: localISOTime});
                  } else {
                    setNewTattoo({...newTattoo, date: ""});
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm text-ink mb-1">Görsel (PC'den Seç) *</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setUploadFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-ink file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-amber file:px-4 file:py-2 file:text-sm file:font-medium file:text-paper-deep hover:file:bg-amber-light"
              />
              {uploadFile && <p className="mt-1 truncate text-xs text-muted">{uploadFile.name}</p>}
            </div>
            <div>
              <label className="block text-sm text-ink mb-1">En-Boy Oranı *</label>
              <select value={newTattoo.aspect} onChange={e => setNewTattoo({...newTattoo, aspect: e.target.value as any})} className="w-full rounded-md border border-hairline bg-parchment px-3 py-2 text-ink focus:border-amber focus:outline-none">
                <option value="portrait">Dikey (Portrait)</option>
                <option value="square">Kare (Square)</option>
                <option value="landscape">Yatay (Landscape)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-ink mb-1">Boyut *</label>
              <select value={newTattoo.size} onChange={e => setNewTattoo({...newTattoo, size: e.target.value as any})} className="w-full rounded-md border border-hairline bg-parchment px-3 py-2 text-ink focus:border-amber focus:outline-none">
                <option value="kucuk">Küçük</option>
                <option value="orta">Orta</option>
                <option value="buyuk">Büyük</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-ink mb-1">Süre <span className="text-muted">(opsiyonel)</span></label>
              <input type="text" value={newTattoo.duration || ""} onChange={e => setNewTattoo({...newTattoo, duration: e.target.value})} className="w-full rounded-md border border-hairline bg-parchment px-3 py-2 text-ink focus:border-amber focus:outline-none" placeholder="Örn: 2 saat" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-ink mb-1">Hikaye <span className="text-muted">(opsiyonel)</span></label>
            <textarea value={newTattoo.story || ""} onChange={e => setNewTattoo({...newTattoo, story: e.target.value})} className="w-full h-24 rounded-md border border-hairline bg-parchment px-3 py-2 text-ink focus:border-amber focus:outline-none" />
          </div>
          
          <div className="flex justify-end gap-4 mt-4">
            <button type="button" onClick={cancelForm} className="px-4 py-2 text-muted hover:text-ink">İptal</button>
            <button type="submit" disabled={loading} className="soft-card--link flex items-center justify-center rounded-md bg-amber px-6 py-2 text-sm font-medium text-paper-deep disabled:opacity-50">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Kaydet"}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div key={item.id} className="soft-card overflow-hidden">
            <div className="relative aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-xl text-ink">#{items.length - index} {item.title}</h3>
                <p className="text-sm text-muted">{item.style}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(item)} disabled={loading} className="text-amber hover:text-amber-light disabled:opacity-50">
                  <Pencil className="h-5 w-5" />
                </button>
                <button onClick={() => handleDelete(item.id)} disabled={loading} className="text-red-400 hover:text-red-300 disabled:opacity-50">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
