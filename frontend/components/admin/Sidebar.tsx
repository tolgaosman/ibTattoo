"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, MessageSquare, Image as ImageIcon, Settings, LogOut } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Galeri", href: "/admin/portfolio", icon: ImageIcon },
  { name: "Ayarlar", href: "/admin/settings", icon: Settings },
];

export function Sidebar({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (err) {
      console.error("Çıkış yapılırken hata oluştu");
    }
  };

  return (
    <aside className="fixed bottom-0 inset-x-0 flex flex-row md:inset-y-0 md:left-0 md:h-screen md:w-64 md:flex-col bg-paper-deep border-t md:border-t-0 md:border-r border-hairline z-50">
      <div className="hidden md:flex h-16 shrink-0 items-center justify-center border-b border-hairline px-6">
        <h2 className="font-serif text-2xl text-amber-light">tatt2me Admin Panel</h2>
      </div>
      
      <nav className="flex-1 flex flex-row justify-around md:flex-col md:justify-start space-y-0 md:space-y-1 p-2 md:p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col md:flex-row items-center md:space-x-3 rounded-md px-2 py-2 md:px-3 text-xs md:text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-soft text-amber-light"
                  : "text-ink hover:bg-parchment hover:text-amber-light"
              }`}
            >
              <item.icon className={`h-6 w-6 mb-1 md:mb-0 md:h-5 md:w-5 ${isActive ? "text-amber-light" : "text-muted"}`} />
              <span className="hidden md:inline">{item.name}</span>
            </Link>
          );
        })}

        {/* Mobile logout button */}
        <button
          onClick={handleLogout}
          className="flex flex-col md:hidden items-center rounded-md px-2 py-2 text-xs font-medium text-ink transition-colors hover:bg-parchment hover:text-amber-light"
        >
          <LogOut className="h-6 w-6 mb-1 text-muted" />
          <span className="hidden md:inline">Çıkış Yap</span>
        </button>
      </nav>

      <div className="hidden md:block border-t border-hairline p-4">
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
