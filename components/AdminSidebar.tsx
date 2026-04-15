"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Bell,
  Lightbulb,
  LogOut,
  ChevronRight,
} from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/employes", label: "Employés", icon: Users },
  { href: "/admin/problemes", label: "Problèmes", icon: AlertTriangle },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/idees", label: "Boîte à idées", icon: Lightbulb },
];

const PRIMARY = "#1e3a8a";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const initials = session?.user?.name
    ? session.user.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  return (
    <aside
      className="fixed top-0 left-0 h-full w-64 bg-white flex flex-col z-20"
      style={{ borderRight: "1px solid #f0f0f0" }}
    >
      <div className="px-6 py-5" style={{ borderBottom: "1px solid #f0f0f0" }}>
        <span className="text-2xl font-extrabold tracking-tight" style={{ color: PRIMARY }}>
          LEONI
        </span>
        <span
          className="ml-2 text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ backgroundColor: "#eff6ff", color: PRIMARY }}
        >
          Admin
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {adminNav.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium relative transition-colors"
              style={active ? { backgroundColor: PRIMARY, color: "#fff" } : { color: "#4b5563" }}
              onMouseEnter={(e) => {
                if (!active) { e.currentTarget.style.backgroundColor = "#f9fafb"; e.currentTarget.style.color = "#111827"; }
              }}
              onMouseLeave={(e) => {
                if (!active) { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = "#4b5563"; }
              }}
            >
              <Icon size={18} />
              {label}
              {active && <span className="absolute right-0 top-2 bottom-2 w-1 rounded-l-full" style={{ backgroundColor: "#93c5fd" }} />}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-5 pt-4" style={{ borderTop: "1px solid #f0f0f0" }}>
        <Link
          href="/tableau-de-bord"
          className="flex items-center gap-2 text-xs text-blue-600 mb-3 hover:underline"
        >
          <ChevronRight size={12} />
          Portail employé
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 text-sm text-gray-500 w-full px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span
            className="w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: PRIMARY }}
          >
            {initials}
          </span>
          <span className="flex-1 text-left truncate text-xs">{session?.user?.name}</span>
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );
}
