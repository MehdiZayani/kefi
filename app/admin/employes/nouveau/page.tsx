"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PRIMARY = "#1e3a8a";

type Department = { id: string; name: string };

export default function NouvelEmployePage() {
  const router = useRouter();
  const [depts, setDepts] = useState<Department[]>([]);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "",
    phone: "", position: "", matricule: "", departmentId: "",
    role: "USER", isActive: true, performance: 90, site: "Sousse, Tunisie",
    dateEmbauche: new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/departments").then((r) => r.json()).then(setDepts);
  }, []);

  function update(field: string, value: string | boolean | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Erreur"); return; }
    router.push("/admin/employes");
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-2" style={{ color: "#111827" }}>Nouvel Employé</h1>
      <p className="text-gray-500 text-sm mb-8">Créer un nouveau compte employé.</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm max-w-2xl">
        <div className="grid grid-cols-2 gap-5">
          {[
            { label: "Prénom", field: "firstName", type: "text" },
            { label: "Nom", field: "lastName", type: "text" },
            { label: "Email", field: "email", type: "email" },
            { label: "Mot de passe", field: "password", type: "password" },
            { label: "Téléphone", field: "phone", type: "text" },
            { label: "Poste", field: "position", type: "text" },
            { label: "Matricule", field: "matricule", type: "text" },
            { label: "Date d'embauche", field: "dateEmbauche", type: "date" },
            { label: "Site", field: "site", type: "text" },
            { label: "Performance (%)", field: "performance", type: "number" },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5 text-gray-500">{label}</label>
              <input type={type} value={String(form[field as keyof typeof form])}
                onChange={(e) => update(field, type === "number" ? Number(e.target.value) : e.target.value)}
                required={["firstName","lastName","email","password","matricule"].includes(field)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ border: "1px solid #e5e7eb", color: "#111827" }} />
            </div>
          ))}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5 text-gray-500">Département</label>
            <select value={form.departmentId} onChange={(e) => update("departmentId", e.target.value)} required
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ border: "1px solid #e5e7eb", color: "#111827" }}>
              <option value="">Choisir...</option>
              {depts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5 text-gray-500">Rôle</label>
            <select value={form.role} onChange={(e) => update("role", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ border: "1px solid #e5e7eb", color: "#111827" }}>
              <option value="USER">Employé</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <input type="checkbox" id="isActive" checked={form.isActive}
            onChange={(e) => update("isActive", e.target.checked)} className="w-4 h-4" />
          <label htmlFor="isActive" className="text-sm text-gray-600">Compte actif</label>
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-60"
            style={{ backgroundColor: PRIMARY }}>
            {loading ? "Création..." : "Créer l'employé"}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-600"
            style={{ border: "1px solid #e5e7eb" }}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
