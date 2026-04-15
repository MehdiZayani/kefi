import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminIdees() {
  const ideas = await prisma.idea.findMany({
    orderBy: { createdAt: "desc" },
    include: { Employee: true },
  });

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-2" style={{ color: "#111827" }}>Boîte à idées</h1>
      <p className="text-gray-500 text-sm mb-8">{ideas.length} suggestion(s) soumise(s)</p>

      <div className="grid grid-cols-2 gap-5">
        {ideas.map((idea) => (
          <div key={idea.id} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "#eff6ff", color: "#1e3a8a" }}>
                {idea.category}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(idea.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-4">{idea.content}</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: "#1e3a8a" }}>
                {idea.Employee.firstName[0]}{idea.Employee.lastName[0]}
              </div>
              <span className="text-xs text-gray-500">{idea.Employee.firstName} {idea.Employee.lastName}</span>
            </div>
          </div>
        ))}
        {ideas.length === 0 && (
          <div className="col-span-2 text-center text-gray-400 py-16">Aucune idée soumise</div>
        )}
      </div>
    </div>
  );
}
