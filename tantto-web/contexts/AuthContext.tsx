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
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      console.log(res);
      // TODO: add toast

      return;
    } else {
      // TODO: add toast

      router.replace("/usuarios");
    }
  }

  async function logOut() {
    signOut();
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
