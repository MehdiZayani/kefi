import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProblemDetailClient from "./ProblemDetailClient";

export const dynamic = "force-dynamic";

export default async function ProblemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const problem = await prisma.problem.findUnique({
    where: { id },
    include: { Employee: { include: { Department: true } }, Department: true },
  });
  if (!problem) notFound();
  return <ProblemDetailClient problem={JSON.parse(JSON.stringify(problem))} />;
}
