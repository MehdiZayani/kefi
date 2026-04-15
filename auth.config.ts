import type { NextAuthConfig } from "next-auth";

// Config minimale pour l'Edge middleware (sans Prisma)
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
        token.matricule = (user as { matricule: string }).matricule;
        token.department = (user as { department: string }).department;
        token.position = (user as { position: string }).position;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.matricule = token.matricule as string;
        session.user.department = token.department as string;
        session.user.position = token.position as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
