import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/tableau-de-bord");
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f3f4f6" }}>
      <AdminSidebar />
      <main className="pl-64 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
