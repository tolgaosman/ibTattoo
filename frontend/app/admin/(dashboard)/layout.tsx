import { Sidebar } from "@/components/admin/Sidebar";

export const metadata = {
  title: "Admin Paneli",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pl-64">
        <div className="mx-auto max-w-7xl p-8">{children}</div>
      </main>
    </div>
  );
}
