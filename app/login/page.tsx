"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
    } else {
      // Redirect based on role — check session
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      if (session?.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/tableau-de-bord");
      }
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#f3f4f6" }}
    >
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <span
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: "#1e3a8a" }}
            >
              LEONI
            </span>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
              Portail Employé
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ border: "1px solid #e5e7eb", color: "#111827" }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ border: "1px solid #e5e7eb", color: "#111827" }}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 rounded-xl text-white text-sm font-bold uppercase tracking-widest disabled:opacity-60 transition-opacity"
              style={{ backgroundColor: "#1e3a8a" }}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div
            className="mt-6 p-4 rounded-xl text-xs text-gray-500"
            style={{ backgroundColor: "#f9fafb", border: "1px solid #f0f0f0" }}
          >
            <p className="font-semibold text-gray-600 mb-2">Comptes de démonstration :</p>
            <p><span className="font-mono text-blue-700">admin@leoni.com</span> / <span className="font-mono">admin123</span> (Admin)</p>
            <p className="mt-1"><span className="font-mono text-blue-700">mohamed.hamdi@leoni.com</span> / <span className="font-mono">password123</span> (Employé)</p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 italic">
          &ldquo;Connectés pour l&apos;avenir.&rdquo;
        </p>
      </div>
    </div>
  );
}
