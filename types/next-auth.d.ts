import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
      matricule: string;
      department: string;
      position: string;
    };
  }

  interface User {
    role: string;
    matricule: string;
    department: string;
    position: string;
  }
}
