import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const SERVICE_DEPT_MAP: Record<string, string> = {
  IT: "Service Informatique",
  MAINT: "Maintenance & Infrastructure",
  RH: "Ressources Humaines",
  LOGIS: "Logistique",
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { serviceId, title, description, priority } = body as {
    serviceId: string;
    title: string;
    description: string;
    priority: string;
  };

  if (!serviceId || !title?.trim() || !description?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const employee = await prisma.employee.findFirst({
    orderBy: { createdAt: "asc" },
  });
  if (!employee) {
    return NextResponse.json({ error: "No employee found" }, { status: 404 });
  }

  const deptName = SERVICE_DEPT_MAP[serviceId] ?? serviceId;
  let department = await prisma.department.findFirst({
    where: { name: deptName },
  });
  if (!department) {
    department = await prisma.department.create({
      data: { id: randomUUID(), name: deptName, updatedAt: new Date() },
    });
  }

  const validPriorities = ["BASSE", "MOYENNE", "HAUTE", "URGENTE"];
  const safePriority = validPriorities.includes(priority) ? priority : "MOYENNE";

  const problem = await prisma.problem.create({
    data: {
      id: randomUUID(),
      title,
      description,
      priority: safePriority as "BASSE" | "MOYENNE" | "HAUTE" | "URGENTE",
      departmentId: department.id,
      employeeId: employee.id,
    },
  });

  return NextResponse.json(problem, { status: 201 });
}
