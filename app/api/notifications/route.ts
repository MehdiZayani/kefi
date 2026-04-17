import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const notifications = await prisma.notification.findMany({
    where: { employeeId: session.user.id },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(notifications);
}
