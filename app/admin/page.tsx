import { prisma } from "@/lib/prisma";
import { Users, AlertTriangle, Bell, Lightbulb, CheckCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [employees, problems, notifications, ideas] = await Promise.all([
    prisma.employee.count(),
    prisma.problem.groupBy({ by: ["status"], _count: true }),
    prisma.notification.count({ where: { isRead: false } }),
    prisma.idea.count(),
  ]);

  const problemsByStatus = Object.fromEntries(problems.map((p) => [p.status, p._count]));
  const totalProblems = problems.reduce((acc, p) => acc + p._count, 0);

  const recentProblems = await prisma.problem.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { Employee: true, Department: true },
  });

  const recentEmployees = await prisma.employee.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { Department: true },
  });

  const stats = [
    { label: "Employés total", value: employees, icon: Users, color: "#3b82f6", bg: "#eff6ff", href: "/admin/employes" },
    { label: "Problèmes ouverts", value: problemsByStatus["OUVERT"] ?? 0, icon: AlertTriangle, color: "#ef4444", bg: "#fef2f2", href: "/admin/problemes" },
    { label: "Notifs non lues", value: notifications, icon: Bell, color: "#f59e0b", bg: "#fffbeb", href: "/admin/notifications" },
    { label: "Idées soumises", value: ideas, icon: Lightbulb, color: "#10b981", bg: "#ecfdf5", href: "/admin/idees" },
  ];

  const statusColor: Record<string, string> = {
    OUVERT: "#ef4444", EN_COURS: "#f59e0b", RESOLU: "#10b981", FERME: "#6b7280",
  };
  const statusLabel: Record<string, string> = {
    OUVERT: "Ouvert", EN_COURS: "En cours", RESOLU: "Résolu", FERME: "Fermé",
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-1" style={{ color: "#111827" }}>
        Dashboard Administration
      </h1>
      <p className="text-gray-500 text-sm mb-8">Vue d&apos;ensemble du système LEONI.</p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href}
            className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
              <Icon size={22} style={{ color }} />
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: "#111827" }}>{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Répartition problèmes */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {(["OUVERT", "EN_COURS", "RESOLU", "FERME"] as const).map((s) => (
          <div key={s} className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-xl font-bold" style={{ color: statusColor[s] }}>{problemsByStatus[s] ?? 0}</div>
            <div className="text-xs text-gray-500 mt-0.5">{statusLabel[s]}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Derniers problèmes */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-sm" style={{ color: "#111827" }}>Derniers problèmes</h3>
            <Link href="/admin/problemes" className="text-xs font-semibold" style={{ color: "#1e3a8a" }}>Voir tout</Link>
          </div>
          <div className="space-y-3">
            {recentProblems.map((p) => (
              <div key={p.id} className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: statusColor[p.status] }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: "#111827" }}>{p.title}</div>
                  <div className="text-xs text-gray-400">{p.Employee.firstName} {p.Employee.lastName} · {p.Department.name}</div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: statusColor[p.status] + "20", color: statusColor[p.status] }}>
                  {statusLabel[p.status]}
                </span>
              </div>
            ))}
            {recentProblems.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Aucun problème</p>}
          </div>
        </div>

        {/* Derniers employés */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-sm" style={{ color: "#111827" }}>Derniers employés inscrits</h3>
            <Link href="/admin/employes" className="text-xs font-semibold" style={{ color: "#1e3a8a" }}>Voir tout</Link>
          </div>
          <div className="space-y-3">
            {recentEmployees.map((e) => (
              <div key={e.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: "#1e3a8a" }}>
                  {e.firstName[0]}{e.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: "#111827" }}>{e.firstName} {e.lastName}</div>
                  <div className="text-xs text-gray-400 truncate">{e.Department?.name} · {e.position ?? "—"}</div>
                </div>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: e.isActive ? "#10b981" : "#ef4444" }} />
              </div>
            ))}
            {recentEmployees.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Aucun employé</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
