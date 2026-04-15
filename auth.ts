import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email as string;
        const password = credentials.password as string;

        const employee = await prisma.employee.findUnique({
          where: { email },
          include: { Department: true },
        });

        if (!employee) return null;

        const valid = await bcrypt.compare(password, employee.password);
        if (!valid) return null;

        return {
          id: employee.id,
          email: employee.email,
          name: `${employee.firstName} ${employee.lastName}`,
          role: employee.role,
          matricule: employee.matricule,
          department: employee.Department?.name ?? "",
          position: employee.position ?? "",
        };
      },
    }),
  ],
});
