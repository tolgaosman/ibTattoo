"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, MessageSquare, Image as ImageIcon, Settings, LogOut } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Galeri", href: "/admin/portfolio", icon: ImageIcon },
  { name: "Mesajlar", href: "/admin/messages", icon: MessageSquare },
  { name: "Ayarlar", href: "/admin/settings", icon: Settings },
];

export function Sidebar({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (err) {
      console.error("Çıkış yapılırken hata oluştu");
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 flex h-screen w-64 flex-col bg-paper-deep border-r border-hairline">
      <div className="flex h-16 items-center justify-center border-b border-hairline px-6">
        <h2 className="font-serif text-2xl text-amber-light">tatt2me Admin Panel</h2>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-soft text-amber-light"
                  : "text-ink hover:bg-parchment hover:text-amber-light"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-amber-light" : "text-muted"}`} />
              <span className="flex-1">{item.name}</span>
              {item.href === "/admin/messages" && unreadCount > 0 && (
                <span className="rounded-full bg-amber px-2 py-0.5 text-xs font-semibold text-paper-deep">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-hairline p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-parchment hover:text-amber-light"
        >
          <LogOut className="h-5 w-5 text-muted" />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}
