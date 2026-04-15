"use client";

import { Bell, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Topbar() {
  const { data: session } = useSession();
  const name = session?.user?.name ?? "";
  const initials = name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
  const dept = (session?.user as { department?: string })?.department ?? "";

  return (
    <header className="fixed top-0 left-60 right-0 h-16 bg-white flex items-center px-6 gap-4 z-10" style={{ borderBottom: "1px solid #f0f0f0" }}>
      <div className="relative max-w-xs w-full">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
        <input type="text" placeholder="Rechercher..." className="w-full pl-9 pr-4 py-2 text-sm rounded-full outline-none" style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", color: "#374151" }} />
      </div>
      <div className="flex-1" />
      <Link href="/notifications" className="relative p-2 rounded-full hover:bg-gray-50 transition-colors">
        <Bell size={20} style={{ color: "#6b7280" }} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "#ef4444" }} />
      </Link>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: "#1e3a8a" }}>
          {initials || "?"}
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: "#111827" }}>
            {name.split(" ")[0]} {name.split(" ")[1]?.[0]}.
          </div>
          <div className="text-xs uppercase tracking-wide" style={{ color: "#9ca3af" }}>{dept}</div>
        </div>
      </div>
    </header>
  );
}
