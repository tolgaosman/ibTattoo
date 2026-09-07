import { getAppointments } from "@/lib/appointments";
import { MessagesList } from "@/components/admin/MessagesList";

export const revalidate = 0;

export default async function AdminMessages() {
  const appointments = await getAppointments();

  return (
    <div className="space-y-8 hero-rise">
      <div>
        <h1 className="font-serif text-4xl text-amber-light">Mesajlar</h1>
        <p className="mt-2 text-muted">İletişim formundan gelen randevu taleplerini buradan yönetin.</p>
      </div>

      {appointments.length === 0 ? (
        <div className="soft-card p-6">
          <p className="text-muted">Gelen kutusu şu an boş.</p>
        </div>
      ) : (
        <MessagesList initialAppointments={appointments} />
      )}
    </div>
  );
}
