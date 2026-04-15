"use client";

import { useEffect, useState } from "react";
import { Send, Star, ThumbsUp, Users } from "lucide-react";

const PRIMARY = "#1e3a8a";

const CATEGORIES = [
  "Espace de travail",
  "Transport",
  "Restauration",
  "Sécurité",
  "Formation",
  "Informatique",
  "Environnement",
  "Autre",
];

type Trend = { label: string; count: number; icon: React.ElementType };

const TRENDS: Trend[] = [
  { label: "Espaces Verts", count: 124, icon: Star },
  { label: "Bornes de Charge", count: 89, icon: ThumbsUp },
  { label: "Team Building", count: 56, icon: Users },
];

export default function RemarquesPage() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Reset success after 3s
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) {
      setError("Veuillez saisir votre proposition.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, content }),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setContent("");
      setCategory(CATEGORIES[0]);
      setSuccess(true);
    } catch {
      setError("Une erreur s'est produite, veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold" style={{ color: "#111827" }}>
        Boîte à Idées
      </h1>
      <p className="text-gray-500 text-sm mt-1 mb-8">
        Vos suggestions pour améliorer la vie chez LEONI.
      </p>

      <div className="grid grid-cols-3 gap-6">
        {/* Form */}
        <div className="col-span-2 bg-white rounded-2xl p-7 shadow-sm">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: "#9ca3af" }}
          >
            Partagez votre idée
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "#6b7280" }}
              >
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  border: "1px solid #e5e7eb",
                  color: "#111827",
                  backgroundColor: "#fff",
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "#6b7280" }}
              >
                Ma Proposition
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Comment pouvons-nous faire mieux ?"
                rows={5}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                style={{
                  border: "1px solid #e5e7eb",
                  color: "#111827",
                  backgroundColor: "#fff",
                }}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-600 font-medium">
                Votre idée a été soumise avec succès !
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest text-white py-3 rounded-xl transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "#111827" }}
            >
              <Send size={14} />
              {submitting ? "Envoi..." : "Soumettre l'idée"}
            </button>
          </form>
        </div>

        {/* Side */}
        <div className="flex flex-col gap-5">
          <div
            className="rounded-2xl p-6 text-white"
            style={{ backgroundColor: PRIMARY }}
          >
            <div
              className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              💡
            </div>
            <h3 className="font-extrabold text-lg mb-2">Votre voix compte.</h3>
            <p className="text-sm opacity-80">
              Chaque mois, les 3 meilleures suggestions sont récompensées et mises
              en œuvre dans nos usines. Participez à l&apos;évolution de LEONI&nbsp;!
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h4
              className="font-bold text-sm mb-4"
              style={{ color: "#111827" }}
            >
              Tendances actuelles
            </h4>
            <div className="space-y-3">
              {TRENDS.map(({ label, count, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon size={16} style={{ color: "#9ca3af" }} />
                  <span className="text-sm text-gray-600 flex-1">{label}</span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: PRIMARY }}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
