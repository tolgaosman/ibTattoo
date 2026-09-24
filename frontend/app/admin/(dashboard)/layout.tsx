import { unstable_rethrow } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { adminFetch } from "@/lib/api";
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
  // middleware.ts only checks that the `admin_session` cookie exists, not
  // that it's a valid, unexpired Sanctum token — any visitor can set that
  // cookie to any value and pass that check. This is the actual
  // authorization gate for every page under (dashboard): adminFetch redirects
  // to /admin/login on a 401, and unlike getAppointments below, nothing here
  // catches that redirect.
  await adminFetch("/me");

  const appointments = await getAppointments().catch((error) => {
    // adminFetch's redirect() throws Next's own control-flow error for a
    // 401 — letting a real auth failure fall through to the empty-array
    // fallback would render the dashboard instead of bouncing to login.
    unstable_rethrow(error);
    return [];
  });
  const unreadCount = appointments.filter((a) => a.status === "new").length;

  return (
    <div className="flex min-h-screen bg-paper pb-16 md:pb-0">
      <Sidebar unreadCount={unreadCount} />
      <main className="flex-1 overflow-y-auto md:pl-64">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
