"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PRIMARY = "#1e3a8a";

type Problem = {
  id: string; title: string; description: string;
  status: string; priority: string; response: string | null;
  createdAt: string;
  Employee: { firstName: string; lastName: string; email: string; matricule: string };
  Department: { name: string };
};

const STATUSES = [
  { value: "OUVERT", label: "Ouvert" },
  { value: "EN_COURS", label: "En cours" },
  { value: "RESOLU", label: "Résolu" },
  { value: "FERME", label: "Fermé" },
];

const statusColor: Record<string, string> = {
  OUVERT: "#ef4444", EN_COURS: "#f59e0b", RESOLU: "#10b981", FERME: "#6b7280",
};

export default function ProblemDetailClient({ problem }: { problem: Problem }) {
  const router = useRouter();
  const [status, setStatus] = useState(problem.status);
  const [response, setResponse] = useState(problem.response ?? "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/admin/problems/${problem.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, response }),
    });
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div>
      <button onClick={() => router.back()} className="text-sm text-blue-600 hover:underline mb-6 block">← Retour</button>
      <h1 className="text-2xl font-extrabold mb-1" style={{ color: "#111827" }}>{problem.title}</h1>
      <p className="text-gray-500 text-sm mb-8">Soumis le {new Date(problem.createdAt).toLocaleDateString("fr-FR")}</p>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col gap-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-sm mb-3" style={{ color: "#111827" }}>Description</h3>
            <p className="text-sm text-gray-600">{problem.description}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-sm mb-3" style={{ color: "#111827" }}>Réponse / Traitement</h3>
            <textarea value={response} onChange={(e) => setResponse(e.target.value)} rows={5}
              placeholder="Saisissez votre réponse..."
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ border: "1px solid #e5e7eb", color: "#111827" }} />

            <div className="flex items-center gap-3 mt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5 text-gray-500">Statut</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}
                  className="px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: "1px solid #e5e7eb", color: "#111827" }}>
                  {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <button onClick={handleSave} disabled={saving}
                className="mt-5 px-6 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-60"
                style={{ backgroundColor: PRIMARY }}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
              {success && <p className="mt-5 text-sm text-green-600 font-medium">Sauvegardé !</p>}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-sm mb-4" style={{ color: "#111827" }}>Informations</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Employé</p>
                <p className="font-semibold text-gray-800">{problem.Employee.firstName} {problem.Employee.lastName}</p>
                <p className="text-gray-500 text-xs">{problem.Employee.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Matricule</p>
                <p className="font-mono text-gray-700">{problem.Employee.matricule}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Service</p>
                <p className="text-gray-700">{problem.Department.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Priorité</p>
                <p className="font-semibold text-gray-800">{problem.priority}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Statut actuel</p>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: statusColor[problem.status] + "20", color: statusColor[problem.status] }}>
                  {problem.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
