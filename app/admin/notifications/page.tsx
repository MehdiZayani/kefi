import { prisma } from "@/lib/prisma";
import AdminNotificationsClient from "./AdminNotificationsClient";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  const notifications = await prisma.notification.findMany({
    orderBy: { date: "desc" },
    include: { Employee: true },
    take: 100,
  });
  const employees = await prisma.employee.findMany({ orderBy: { firstName: "asc" } });

  return (
    <AdminNotificationsClient
      notifications={JSON.parse(JSON.stringify(notifications))}
      employees={JSON.parse(JSON.stringify(employees))}
    />
  );
}
