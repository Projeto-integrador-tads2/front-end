import axios from "axios";
import { getServerSession } from "next-auth";
import { getSession, signOut } from "next-auth/react";
import nextAuthOptions from "@/config/auth"; // ajuste o caminho se necessário

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5135/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (request) => {
  const isServer = typeof window === "undefined";

  if (isServer) {
    const session = await getServerSession(nextAuthOptions);
    if (session?.token) {
      request.headers.Authorization = `Bearer ${session.token}`;
    }
  } else {
    const session = await getSession();
    if (session?.token) {
      request.headers.Authorization = `Bearer ${session.token}`;
    }
  }

  return request;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      signOut({ callbackUrl: "/" });
    }
    return Promise.reject(error);
  }
);

export default api;