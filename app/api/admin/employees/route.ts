import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
    include: { Department: true },
  });
  return NextResponse.json(employees);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    firstName, lastName, email, password, phone, position,
    matricule, departmentId, role, isActive, performance, site, dateEmbauche,
  } = body;

  if (!firstName || !lastName || !email || !password || !matricule || !departmentId) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  }

  const existing = await prisma.employee.findFirst({
    where: { OR: [{ email }, { matricule }] },
  });
  if (existing) {
    return NextResponse.json({ error: "Email ou matricule déjà utilisé" }, { status: 409 });
  }

  const hashedPwd = await bcrypt.hash(password, 10);
  const employee = await prisma.employee.create({
    data: {
      id: randomUUID(),
      firstName, lastName, email,
      password: hashedPwd,
      phone: phone || null,
      position: position || null,
      matricule,
      departmentId,
      role: role === "ADMIN" ? "ADMIN" : "USER",
      isActive: isActive !== false,
      performance: Number(performance) || 90,
      site: site || null,
      dateEmbauche: dateEmbauche ? new Date(dateEmbauche) : null,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(employee, { status: 201 });
}
