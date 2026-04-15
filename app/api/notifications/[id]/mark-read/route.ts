import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
  return NextResponse.json({ ok: true });
}
