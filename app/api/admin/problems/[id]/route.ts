import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const problem = await prisma.problem.findUnique({
    where: { id },
    include: { Employee: true, Department: true },
  });
  if (!problem) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(problem);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { status, response } = body as { status: string; response: string };

  const validStatuses = ["OUVERT", "EN_COURS", "RESOLU", "FERME"];
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const problem = await prisma.problem.update({
    where: { id },
    data: {
      ...(status && { status: status as "OUVERT" | "EN_COURS" | "RESOLU" | "FERME" }),
      ...(response !== undefined && { response }),
      ...(status === "RESOLU" && { resolvedAt: new Date() }),
    },
  });

  return NextResponse.json(problem);
}
