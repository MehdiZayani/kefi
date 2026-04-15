import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { category, content } = body as { category: string; content: string };

  if (!category?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const employee = await prisma.employee.findFirst({
    orderBy: { createdAt: "asc" },
  });
  if (!employee) {
    return NextResponse.json({ error: "No employee found" }, { status: 404 });
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
