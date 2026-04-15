import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const employee = await prisma.employee.findFirst({
    orderBy: { createdAt: "asc" },
  });
  if (!employee) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.notification.updateMany({
    where: { employeeId: employee.id },
    data: { isRead: true },
  });
  return NextResponse.json({ ok: true });
}
