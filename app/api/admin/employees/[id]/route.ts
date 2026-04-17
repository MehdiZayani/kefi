import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  const { id } = await params;
  const emp = await prisma.employee.findUnique({ where: { id } });
  if (!emp) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...rest } = emp;
  return NextResponse.json(rest);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();
  const {
    firstName, lastName, email, password, phone, position,
    matricule, departmentId, role, isActive, performance, site, dateEmbauche,
  } = body;

  const data: Record<string, unknown> = {
    firstName, lastName, email, phone: phone || null,
    position: position || null, matricule, departmentId,
    role: role === "ADMIN" ? "ADMIN" : "USER",
    isActive: isActive !== false,
    performance: Number(performance) || 90,
    site: site || null,
    dateEmbauche: dateEmbauche ? new Date(dateEmbauche) : null,
    updatedAt: new Date(),
  };

  if (password && password.trim()) {
    data.password = await bcrypt.hash(password, 10);
  }

  const emp = await prisma.employee.update({ where: { id }, data });
  return NextResponse.json(emp);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  const { id } = await params;
  await prisma.employee.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
