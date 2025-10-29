"use client";

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, createContext, useContext } from "react";

import { LoginData } from "@/validators/login-schema";

interface AuthContextData {
  logIn(arg: LoginData): Promise<void>;
  logOut(): Promise<void>;
}

interface Props {
  children?: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: Props) {
  const router = useRouter();

  async function logIn(data: LoginData) {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        console.error("Login error:", res.error);
        // TODO: add toast
        throw new Error(res.error);
      }

      if (res?.ok) {
        // TODO: add toast - Login realizado com sucesso
        router.replace("/usuarios");
      }
    } catch (error) {
      console.error("Login failed:", error);
      // TODO: add toast
      throw error;
    }
  }

  async function logOut() {
    await signOut({ callbackUrl: "/auth/login" });
  }

  const values = {
    logIn,
    logOut,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
