import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  const body = await req.json();
  const { type, title, description, employeeId } = body as {
    type: string;
    title: string;
    description: string;
    employeeId: string;
  };

  if (!type || !title || !description || !employeeId) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee) {
    return NextResponse.json({ error: "Employé introuvable" }, { status: 404 });
  }

  const notification = await prisma.notification.create({
    data: {
      id: randomUUID(),
      type: type as "ABSENCE" | "RETARD" | "REMARQUE" | "ALERT",
      title,
      description,
      employeeId,
      isRead: false,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(notification, { status: 201 });
}
