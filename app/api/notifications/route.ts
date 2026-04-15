import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const employee = await prisma.employee.findFirst({
    orderBy: { createdAt: "asc" },
  });
  if (!employee) return NextResponse.json([]);

  const notifications = await prisma.notification.findMany({
    where: { employeeId: employee.id },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(notifications);
}
