import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusColor: Record<string, string> = {
  OUVERT: "#ef4444", EN_COURS: "#f59e0b", RESOLU: "#10b981", FERME: "#6b7280",
};
const statusLabel: Record<string, string> = {
  OUVERT: "Ouvert", EN_COURS: "En cours", RESOLU: "Résolu", FERMÉ: "Fermé",
};
const prioColor: Record<string, string> = {
  BASSE: "#10b981", MOYENNE: "#f59e0b", HAUTE: "#ef4444", URGENTE: "#7c3aed",
};

export default async function AdminProblemes() {
  const problems = await prisma.problem.findMany({
    orderBy: { createdAt: "desc" },
    include: { Employee: true, Department: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: "#111827" }}>Problèmes</h1>
          <p className="text-gray-500 text-sm mt-1">{problems.length} problème(s) au total</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
              {["Titre", "Employé", "Service", "Priorité", "Statut", "Date", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "#9ca3af" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {problems.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                <td className="px-5 py-4 font-semibold max-w-xs truncate" style={{ color: "#111827" }}>{p.title}</td>
                <td className="px-5 py-4 text-gray-600">{p.Employee.firstName} {p.Employee.lastName}</td>
                <td className="px-5 py-4 text-gray-500 text-xs">{p.Department.name}</td>
                <td className="px-5 py-4">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: prioColor[p.priority] + "20", color: prioColor[p.priority] }}>
                    {p.priority}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: statusColor[p.status] + "20", color: statusColor[p.status] }}>
                    {statusLabel[p.status] ?? p.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs text-gray-400">
                  {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-5 py-4">
                  <Link href={`/admin/problemes/${p.id}`}
                    className="text-xs font-semibold hover:underline"
                    style={{ color: "#1e3a8a" }}>
                    Traiter
                  </Link>
                </td>
              </tr>
            ))}
            {problems.length === 0 && (
              <tr><td colSpan={7} className="text-center text-gray-400 py-10">Aucun problème</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
