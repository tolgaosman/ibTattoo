import { Sidebar } from "@/components/admin/Sidebar";
import { getAppointments } from "@/lib/appointments";

export const metadata = {
  title: "Admin Paneli",
};

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appointments = await getAppointments().catch(() => []);
  const unreadCount = appointments.filter((a) => a.status === "new").length;

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar unreadCount={unreadCount} />
      <main className="flex-1 overflow-y-auto pl-64">
        <div className="mx-auto max-w-7xl p-8">{children}</div>
      </main>
    </div>
  );
}
