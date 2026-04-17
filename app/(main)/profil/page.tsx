import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Shield, MapPin, Calendar, Camera, Pencil } from "lucide-react";

const PRIMARY = "#1e3a8a";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const employee = await prisma.employee.findUnique({
    where: { id: session.user.id },
    include: { Department: true },
  });

  if (!employee) {
    return (
      <div className="text-gray-500 text-center py-20">Employé introuvable.</div>
    );
  }

  const dateEmbauche = employee.dateEmbauche
    ? new Date(employee.dateEmbauche).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  const initials =
    employee.firstName[0].toUpperCase() + employee.lastName[0].toUpperCase();

  return (
    <div>
      <h1 className="text-3xl font-extrabold" style={{ color: "#111827" }}>
        Mon Profil
      </h1>
      <p className="text-gray-500 text-sm mt-1 mb-8">
        Gérez vos informations personnelles et professionnelles.
      </p>

      <div className="grid grid-cols-3 gap-6">
        {/* Left card */}
        <div className="flex flex-col gap-5">
          {/* Identity */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {/* Banner */}
            <div
              className="h-28"
              style={{
                background: `linear-gradient(135deg, ${PRIMARY} 0%, #3b82f6 100%)`,
              }}
            />
            {/* Avatar */}
            <div className="flex flex-col items-center -mt-12 pb-6 px-5">
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center text-2xl font-bold shadow"
                  style={{ backgroundColor: "#e5e7eb", color: "#6b7280" }}
                >
                  {employee.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={employee.photoUrl}
                      alt="avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span style={{ color: "#9ca3af", fontSize: 36 }}>👤</span>
                  )}
                </div>
                <button
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center"
                  title="Changer la photo"
                >
                  <Camera size={13} style={{ color: "#6b7280" }} />
                </button>
              </div>

              <h2
                className="mt-4 text-lg font-extrabold italic text-center"
                style={{ color: "#111827" }}
              >
                {employee.firstName} {employee.lastName}
              </h2>
              <p
                className="text-xs font-bold uppercase tracking-widest mt-0.5"
                style={{ color: PRIMARY }}
              >
                Matricule: {employee.matricule}
              </p>
              <span
                className="mt-2 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"
                style={{ backgroundColor: "#ecfdf5", color: "#10b981" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                ACTIF
              </span>

              <button
                className="mt-5 w-full flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest text-white py-2.5 rounded-xl"
                style={{ backgroundColor: "#111827" }}
              >
                <Pencil size={13} />
                Modifier le profil
              </button>
              <button
                className="mt-2 w-full text-xs font-semibold uppercase tracking-widest py-2.5 rounded-xl text-gray-600"
                style={{ border: "1px solid #e5e7eb" }}
              >
                Badge numérique
              </button>
            </div>
          </div>

          {/* Performance */}
          <div
            className="rounded-2xl p-5 shadow-sm"
            style={{ backgroundColor: "#111827" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-extrabold italic text-base">
                Performance
              </span>
              <span
                className="text-2xl font-extrabold"
                style={{ color: "#60a5fa" }}
              >
                {employee.performance}%
              </span>
            </div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
              Score de qualité
            </p>
            <div className="w-full h-2 rounded-full bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${employee.performance}%`,
                  backgroundColor: "#3b82f6",
                }}
              />
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="col-span-2 flex flex-col gap-5">
          {/* Informations Professionnelles */}
          <div className="bg-white rounded-2xl p-7 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Shield size={16} style={{ color: PRIMARY }} />
              <h3
                className="font-extrabold italic text-base"
                style={{ color: "#111827" }}
              >
                Informations Professionnelles
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <InfoField
                icon="🏢"
                label="Département"
                value={employee.Department?.name ?? "—"}
              />
              <InfoField
                icon="📍"
                label="Poste Actuel"
                value={employee.position ?? "—"}
              />
              <InfoField
                icon="📅"
                label="Date d'Embauche"
                value={dateEmbauche}
              />
              <InfoField
                icon="📍"
                label="Site d'Affectation"
                value={employee.site ?? "—"}
              />
            </div>
          </div>

          {/* Coordonnées */}
          <div className="bg-white rounded-2xl p-7 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <span style={{ color: PRIMARY }}>✉</span>
              <h3
                className="font-extrabold italic text-base"
                style={{ color: "#111827" }}
              >
                Coordonnées de Contact
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <InfoField icon="✉" label="Email Pro" value={employee.email} />
              <InfoField
                icon="📞"
                label="Téléphone"
                value={employee.phone ?? "—"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoField({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-xs">{icon}</span>
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "#9ca3af" }}
        >
          {label}
        </p>
      </div>
      <p className="font-bold text-sm" style={{ color: "#111827" }}>
        {value}
      </p>
    </div>
  );
}
