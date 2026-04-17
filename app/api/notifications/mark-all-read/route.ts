import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  await prisma.notification.updateMany({
    where: { employeeId: session.user.id },
    data: { isRead: true },
  });
  return NextResponse.json({ ok: true });
}
