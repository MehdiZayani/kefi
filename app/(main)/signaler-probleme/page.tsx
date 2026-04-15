"use client";

import { useState } from "react";
import {
  Cpu,
  Wrench,
  UserCheck,
  Package,
  Info,
  AlertCircle,
} from "lucide-react";

const PRIMARY = "#1e3a8a";

type Service = {
  id: string;
  label: string;
  subtitle: string;
  icon: React.ElementType;
  departmentId?: string;
};

const SERVICES: Service[] = [
  {
    id: "IT",
    label: "Service Informatique",
    subtitle: "Problèmes De Comptes, Matériel, Logiciels.",
    icon: Cpu,
  },
  {
    id: "MAINT",
    label: "Maintenance & Infrastructure",
    subtitle: "Réparations, Électricité, Climatisation.",
    icon: Wrench,
  },
  {
    id: "RH",
    label: "Ressources Humaines",
    subtitle: "Contrats, Paie, Absences, Congés.",
    icon: UserCheck,
  },
  {
    id: "LOGIS",
    label: "Logistique",
    subtitle: "Transport, Matériel De Production, Stockage.",
    icon: Package,
  },
];

const PRIORITIES = [
  { value: "BASSE", label: "Basse" },
  { value: "MOYENNE", label: "Moyenne" },
  { value: "HAUTE", label: "Haute" },
  { value: "URGENTE", label: "Urgente" },
];

export default function SignalerProblemePage() {
  const [selected, setSelected] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MOYENNE");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) { setError("Veuillez choisir un service."); return; }
    if (!title.trim()) { setError("Veuillez saisir un titre."); return; }
    if (!description.trim()) { setError("Veuillez décrire le problème."); return; }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: selected, title, description, priority }),
      });
      if (!res.ok) throw new Error("Erreur");
      setTitle(""); setDescription(""); setSelected(""); setPriority("MOYENNE");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Une erreur s'est produite.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold" style={{ color: "#111827" }}>
        Signaler un Problème
      </h1>
      <p className="text-gray-500 text-sm mt-1 mb-8">
        Choisissez le service concerné et décrivez votre situation.
      </p>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#9ca3af" }}
            >
              1. Vers quel service vous dirigez-vous ?
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {SERVICES.map(({ id, label, subtitle, icon: Icon }) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => setSelected(id)}
                  className="bg-white rounded-2xl p-5 text-left shadow-sm transition-all"
                  style={
                    selected === id
                      ? {
                          border: `2px solid ${PRIMARY}`,
                          backgroundColor: "#eff6ff",
                        }
                      : {
                          border: "2px solid transparent",
                        }
                  }
                >
                  <Icon
                    size={22}
                    style={{ color: selected === id ? PRIMARY : "#9ca3af" }}
                    className="mb-3"
                  />
                  <div
                    className="font-bold text-sm mb-1"
                    style={{ color: "#111827" }}
                  >
                    {label}
                  </div>
                  <div className="text-xs text-gray-500">{subtitle}</div>
                </button>
              ))}
            </div>

            {/* Step 2 */}
            {selected && (
              <div className="bg-white rounded-2xl p-7 shadow-sm flex flex-col gap-5">
                <p
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#9ca3af" }}
                >
                  2. Décrivez votre problème
                </p>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-gray-500">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex : Ordinateur ne démarre pas"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ border: "1px solid #e5e7eb", color: "#111827" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-gray-500">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Donnez le maximum de détails..."
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                    style={{ border: "1px solid #e5e7eb", color: "#111827" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-gray-500">
                    Priorité
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ border: "1px solid #e5e7eb", color: "#111827" }}
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
                {success && (
                  <p className="text-sm text-green-600 font-medium">
                    Votre problème a été soumis avec succès !
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="text-sm font-bold uppercase tracking-widest text-white py-3 rounded-xl transition-opacity disabled:opacity-60"
                  style={{ backgroundColor: "#111827" }}
                >
                  {submitting ? "Envoi..." : "Soumettre le problème"}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Side */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Info size={16} style={{ color: PRIMARY }} />
              <span className="font-bold text-sm" style={{ color: "#111827" }}>
                Conseils utiles
              </span>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              {[
                "Soyez précis : donnez le lieu exact ou le code d'erreur si disponible.",
                "Urgence : contactez votre superviseur en cas de danger immédiat.",
                "Suivi : une fois soumis, vous pourrez suivre l'évolution en temps réel.",
              ].map((tip, i) => (
                <li key={i} className="flex gap-2">
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: PRIMARY }}
                  />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-2xl p-5 shadow-sm"
            style={{ backgroundColor: "#fef2f2" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-red-600">
                  Services d&apos;urgence
                </p>
                <p className="font-bold text-sm text-red-700">Poste interne 1122</p>
                <p className="text-xs uppercase tracking-widest text-red-500">
                  Sûreté & Secours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
