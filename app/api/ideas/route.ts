import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  const { category, content } = body as { category: string; content: string };

  if (!category?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const employee = await prisma.employee.findUnique({
    where: { id: session.user.id },
  });
  if (!employee) {
    return NextResponse.json({ error: "Employé introuvable" }, { status: 404 });
  }

  const idea = await prisma.idea.create({
    data: {
      id: randomUUID(),
      category,
      content,
      employeeId: employee.id,
    },
  });

  return NextResponse.json(idea, { status: 201 });
}
