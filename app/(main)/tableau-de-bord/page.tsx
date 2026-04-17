import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  Users,
  Clock,
  AlertTriangle,
  Bell,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

const PRIMARY = "#1e3a8a";

export const dynamic = "force-dynamic";

export default async function TableauDeBordPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const employee = await prisma.employee.findUnique({
    where: { id: session.user.id },
    include: {
      Notification: { orderBy: { date: "desc" }, take: 3 },
      Problem: {
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: { Department: true },
      },
    },
  });

  if (!employee) {
    return (
      <div className="text-gray-500 text-center py-20">
        Employé introuvable.
      </div>
    );
  }

  const absences = await prisma.notification.count({
    where: { employeeId: employee.id, type: "ABSENCE" },
  });
  const retards = await prisma.notification.count({
    where: { employeeId: employee.id, type: "RETARD" },
  });
  const problemesOuverts = await prisma.problem.count({
    where: { employeeId: employee.id, status: "OUVERT" },
  });

  const stats = [
    {
      label: "Absences ce mois",
      value: absences,
      icon: Users,
      color: "#3b82f6",
      bg: "#eff6ff",
    },
    {
      label: "Retards",
      value: retards,
      icon: Clock,
      color: "#f59e0b",
      bg: "#fffbeb",
    },
    {
      label: "Problèmes ouverts",
      value: problemesOuverts,
      icon: AlertTriangle,
      color: "#ef4444",
      bg: "#fef2f2",
    },
  ];

  const typeLabelMap: Record<string, string> = {
    ABSENCE: "Absence Justifiée",
    RETARD: "Retard Détecté",
    REMARQUE: "Nouvelle Remarque",
    ALERT: "Alerte",
  };

  function timeAgo(date: Date) {
    const diff = Date.now() - new Date(date).getTime();
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (h < 1) return "À l'instant";
    if (h < 24) return `Il y a ${h} heure${h > 1 ? "s" : ""}`;
    if (d === 1) return "Hier";
    return `Il y a ${d} jours`;
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-1" style={{ color: "#111827" }}>
        Bonjour, {employee.firstName}&nbsp;!
      </h1>
      <p className="text-gray-500 mb-8 text-sm">
        Voici un résumé de votre activité chez LEONI aujourd&apos;hui.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "#9ca3af" }}
            >
              Aujourd&apos;hui
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: bg }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <div
                  className="text-2xl font-bold leading-none"
                  style={{ color: "#111827" }}
                >
                  {value}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mes Tickets */}
      {employee.Problem.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} style={{ color: PRIMARY }} />
              <span className="font-semibold text-sm" style={{ color: "#111827" }}>
                Mes Tickets
              </span>
            </div>
            <Link
              href="/signaler-probleme"
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: PRIMARY }}
            >
              Nouveau ticket
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {employee.Problem.map((p) => {
              const statusColor: Record<string, string> = {
                OUVERT: "#ef4444",
                EN_COURS: "#f59e0b",
                RESOLU: "#10b981",
                FERME: "#6b7280",
              };
              const statusLabel: Record<string, string> = {
                OUVERT: "Ouvert",
                EN_COURS: "En cours",
                RESOLU: "Résolu",
                FERME: "Fermé",
              };
              const color = statusColor[p.status] ?? "#6b7280";
              return (
                <div
                  key={p.id}
                  className="rounded-xl p-4"
                  style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "#111827" }}>
                        {p.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.Department.name}</p>
                    </div>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color + "20", color }}
                    >
                      {statusLabel[p.status]}
                    </span>
                  </div>
                  {p.response && (
                    <div
                      className="mt-3 p-3 rounded-lg text-xs"
                      style={{ backgroundColor: "#ecfdf5", borderLeft: "3px solid #10b981" }}
                    >
                      <p className="font-semibold text-green-700 mb-1">Réponse de l&apos;administration :</p>
                      <p className="text-green-800">{p.response}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-5">
        {/* Notifications récentes */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Bell size={16} style={{ color: PRIMARY }} />
              <span className="font-semibold text-sm" style={{ color: "#111827" }}>
                Notifications Récentes
              </span>
            </div>
            <Link
              href="/notifications"
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: PRIMARY }}
            >
              Voir tout
            </Link>
          </div>
          <div className="space-y-4">
            {employee.Notification.length === 0 && (
              <p className="text-gray-400 text-sm py-4 text-center">
                Aucune notification
              </p>
            )}
            {employee.Notification.map((n) => (
              <div key={n.id} className="flex items-start gap-3">
                <span
                  className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: PRIMARY }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-sm font-semibold truncate"
                      style={{ color: "#111827" }}
                    >
                      {typeLabelMap[n.type] ?? n.type}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {timeAgo(n.date)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {n.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA + statut */}
        <div className="flex flex-col gap-5">
          <div
            className="rounded-2xl p-6 text-white relative overflow-hidden shadow-sm"
            style={{ backgroundColor: PRIMARY }}
          >
            <div
              className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-10"
              style={{ backgroundColor: "#fff" }}
            />
            <h3 className="font-extrabold text-lg mb-2">Un problème&nbsp;?</h3>
            <p className="text-sm opacity-80 mb-5">
              Signalez tout dysfonctionnement technique ou administratif. Nous
              vous redirigerons vers le service compétent.
            </p>
            <Link
              href="/signaler-probleme"
              className="flex items-center gap-2 bg-white text-sm font-semibold px-4 py-2.5 rounded-xl w-full justify-center hover:bg-gray-100 transition-colors"
              style={{ color: PRIMARY }}
            >
              SIGNALER MAINTENANT
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold" style={{ color: "#111827" }}>
                Statut du Service
              </span>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                ● OPÉRATIONNEL
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Tous les systèmes LEONI sont en ligne. Notre équipe technique
              veille au grain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
