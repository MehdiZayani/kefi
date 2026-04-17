import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;

  // Vérifier que la notification appartient bien à l'utilisateur connecté
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification || notification.employeeId !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
  return NextResponse.json({ ok: true });
}
