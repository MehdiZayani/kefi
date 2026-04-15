import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminEmployes() {
  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
    include: { Department: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: "#111827" }}>Employés</h1>
          <p className="text-gray-500 text-sm mt-1">{employees.length} employé(s) enregistré(s)</p>
        </div>
        <Link href="/admin/employes/nouveau"
          className="flex items-center gap-2 text-sm font-bold text-white px-4 py-2.5 rounded-xl"
          style={{ backgroundColor: "#1e3a8a" }}>
          <UserPlus size={16} />
          Nouvel employé
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
              {["Employé", "Matricule", "Département", "Poste", "Rôle", "Statut", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "#9ca3af" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: "#1e3a8a" }}>
                      {e.firstName[0]}{e.lastName[0]}
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: "#111827" }}>{e.firstName} {e.lastName}</div>
                      <div className="text-xs text-gray-400">{e.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 font-mono text-xs text-gray-500">{e.matricule}</td>
                <td className="px-5 py-4 text-gray-600">{e.Department?.name ?? "—"}</td>
                <td className="px-5 py-4 text-gray-600">{e.position ?? "—"}</td>
                <td className="px-5 py-4">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={e.role === "ADMIN"
                      ? { backgroundColor: "#eff6ff", color: "#1e3a8a" }
                      : { backgroundColor: "#f3f4f6", color: "#6b7280" }}>
                    {e.role}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit"
                    style={e.isActive ? { backgroundColor: "#ecfdf5", color: "#10b981" } : { backgroundColor: "#fef2f2", color: "#ef4444" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: e.isActive ? "#10b981" : "#ef4444" }} />
                    {e.isActive ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <Link href={`/admin/employes/${e.id}`}
                    className="text-xs font-semibold hover:underline"
                    style={{ color: "#1e3a8a" }}>
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr><td colSpan={7} className="text-center text-gray-400 py-10">Aucun employé</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
