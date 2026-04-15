import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import * as bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  // --- Département Opérations Electriques ---
  let opsDept = await prisma.department.findFirst({
    where: { name: "Opérations Electriques" },
  });
  if (!opsDept) {
    opsDept = await prisma.department.create({
      data: {
        id: randomUUID(),
        name: "Opérations Electriques",
        description: "Département des opérations électriques",
        contactEmail: "operations@leoni.com",
        contactPhone: "+216 22 000 000",
        location: "Sousse, Tunisie",
        updatedAt: new Date(),
      },
    });
  }

  // --- Département Administration ---
  let adminDept = await prisma.department.findFirst({
    where: { name: "Administration" },
  });
  if (!adminDept) {
    adminDept = await prisma.department.create({
      data: {
        id: randomUUID(),
        name: "Administration",
        description: "Direction & Administration",
        updatedAt: new Date(),
      },
    });
  }

  // --- Compte Admin ---
  let adminEmployee = await prisma.employee.findUnique({
    where: { email: "admin@leoni.com" },
  });
  if (!adminEmployee) {
    const adminPwd = await bcrypt.hash("admin123", 10);
    // Supprimer le matricule "000001" s'il existe sur un autre compte
    await prisma.employee.updateMany({
      where: { matricule: "000001", NOT: { email: "admin@leoni.com" } },
      data: { matricule: `admin-old-${Date.now()}` },
    });
    adminEmployee = await prisma.employee.create({
      data: {
        id: randomUUID(),
        matricule: "000001",
        firstName: "Admin",
        lastName: "LEONI",
        email: "admin@leoni.com",
        password: adminPwd,
        position: "Administrateur Système",
        departmentId: adminDept.id,
        role: "ADMIN",
        isActive: true,
        performance: 100,
        site: "Sousse, Tunisie",
        updatedAt: new Date(),
      },
    });
  }

  // --- Compte Mohamed Hamdi ---
  let mohamedEmployee = await prisma.employee.findUnique({
    where: { email: "mohamed.hamdi@leoni.com" },
  });
  if (!mohamedEmployee) {
    // Supprimer le matricule "002145" s'il existe sur un autre compte
    await prisma.employee.updateMany({
      where: { matricule: "002145", NOT: { email: "mohamed.hamdi@leoni.com" } },
      data: { matricule: `old-${Date.now()}` },
    });
    const pwd = await bcrypt.hash("password123", 10);
    mohamedEmployee = await prisma.employee.create({
      data: {
        id: randomUUID(),
        matricule: "002145",
        firstName: "Mohamed",
        lastName: "Hamdi",
        email: "mohamed.hamdi@leoni.com",
        password: pwd,
        phone: "+216 22 345 678",
        position: "Technicien Supérieur",
        departmentId: opsDept.id,
        dateEmbauche: new Date("2022-01-12"),
        isActive: true,
        performance: 92,
        site: "Sousse, Tunisie",
        updatedAt: new Date(),
      },
    });
  } else {
    // Mettre à jour les données ET réinitialiser le mot de passe
    const pwd = await bcrypt.hash("password123", 10);
    await prisma.employee.update({
      where: { id: mohamedEmployee.id },
      data: {
        firstName: "Mohamed",
        lastName: "Hamdi",
        matricule: "002145",
        password: pwd,
        phone: "+216 22 345 678",
        position: "Technicien Supérieur",
        departmentId: opsDept.id,
        performance: 92,
        site: "Sousse, Tunisie",
        dateEmbauche: new Date("2022-01-12"),
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }

  // --- Notifications pour Mohamed ---
  const notifCount = await prisma.notification.count({
    where: { employeeId: mohamedEmployee.id },
  });

  if (notifCount === 0) {
    const now = new Date();
    await prisma.notification.createMany({
      data: [
        {
          id: randomUUID(),
          type: "ABSENCE",
          title: "Justification Acceptée",
          description: "Votre absence du 15 Avril a été validée par les RH.",
          date: new Date(now.getTime() - 2 * 3600000),
          isRead: false,
          employeeId: mohamedEmployee.id,
          updatedAt: new Date(),
        },
        {
          id: randomUUID(),
          type: "RETARD",
          title: "Retards Cumulés",
          description:
            "Attention : Vous avez atteint 3 retards ce mois-ci. Un entretien peut être requis.",
          date: new Date(now.getTime() - 28 * 3600000),
          isRead: false,
          employeeId: mohamedEmployee.id,
          updatedAt: new Date(),
        },
        {
          id: randomUUID(),
          type: "REMARQUE",
          title: "Service Amélioré",
          description:
            "La direction a pris en compte votre remarque sur le transport du personnel.",
          date: new Date(now.getTime() - 5 * 24 * 3600000),
          isRead: true,
          employeeId: mohamedEmployee.id,
          updatedAt: new Date(),
        },
        {
          id: randomUUID(),
          type: "ALERT",
          title: "Nouveau Planning",
          description:
            "Le planning de production de la semaine prochaine est disponible.",
          date: new Date(now.getTime() - 7 * 24 * 3600000),
          isRead: true,
          employeeId: mohamedEmployee.id,
          updatedAt: new Date(),
        },
      ],
    });
  }

  // --- Problème ouvert ---
  const problemCount = await prisma.problem.count({
    where: { employeeId: mohamedEmployee.id },
  });
  if (problemCount === 0) {
    await prisma.problem.create({
      data: {
        id: randomUUID(),
        title: "Problème réseau poste 12",
        description: "La connexion internet est instable sur le poste 12.",
        status: "OUVERT",
        priority: "HAUTE",
        departmentId: opsDept.id,
        employeeId: mohamedEmployee.id,
      },
    });
  }

  return NextResponse.json({
    message: "Seeded successfully",
    employee: "Mohamed Hamdi",
    admin: "admin@leoni.com",
  });
}
