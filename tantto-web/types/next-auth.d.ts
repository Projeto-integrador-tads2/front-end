import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    token: string;
  }

  interface User extends DefaultUser {
    userId: string;
    name: string;
    email: string;
    role: string;
    token: string;
    message?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    token: string;
  }
}
