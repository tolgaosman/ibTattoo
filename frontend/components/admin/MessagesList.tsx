"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import type { Appointment, AppointmentStatus } from "@/lib/appointments";
import { updateAppointmentStatusAction, deleteAppointmentAction } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  new: "Yeni",
  read: "Okundu",
  archived: "Arşivlendi",
};

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  new: "bg-amber-soft text-amber-light",
  read: "bg-parchment text-ink",
  archived: "bg-parchment text-muted",
};

export function MessagesList({ initialAppointments }: { initialAppointments: Appointment[] }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const router = useRouter();
  const toast = useToast();

  const handleStatus = async (id: number, status: AppointmentStatus) => {
    setLoadingId(id);
    try {
      await updateAppointmentStatusAction(id, status);
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    setLoadingId(id);
    try {
      await deleteAppointmentAction(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      router.refresh();
      toast.success("Mesaj silindi");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="soft-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-serif text-xl text-ink">{appointment.name}</h3>
                <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${STATUS_STYLES[appointment.status]}`}>
                  {STATUS_LABELS[appointment.status]}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{appointment.contact}</p>
            </div>

            <div className="flex items-center gap-2">
              {loadingId === appointment.id ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted" />
              ) : (
                <>
                  {appointment.status !== "read" && (
                    <button
                      onClick={() => handleStatus(appointment.id, "read")}
                      title="Okundu olarak işaretle"
                      className="text-amber hover:text-amber-light"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </button>
                  )}
                  {appointment.status !== "archived" && (
                    <button
                      onClick={() => handleStatus(appointment.id, "archived")}
                      title="Arşivle"
                      className="text-muted hover:text-ink"
                    >
                      <Archive className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(appointment.id)}
                    title="Sil"
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-muted">Bölge</dt>
              <dd className="text-ink">{appointment.placement}</dd>
            </div>
            <div>
              <dt className="text-muted">Boyut</dt>
              <dd className="text-ink">{appointment.size} cm</dd>
            </div>
            {appointment.dates && (
              <div>
                <dt className="text-muted">Tarih Aralığı</dt>
                <dd className="text-ink">{appointment.dates}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted">Gönderim</dt>
              <dd className="text-ink">{new Date(appointment.createdAt).toLocaleDateString("tr-TR")}</dd>
            </div>
          </dl>

          <p className="mt-4 text-ink-soft">{appointment.idea}</p>
        </div>
      ))}
    </div>
  );
}
