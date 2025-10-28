import axios from "axios";
import { getServerSession } from "next-auth";
import { getSession, signOut } from "next-auth/react";

import nextAuthOptions from "@/config/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(async (request) => {
  const isServer = typeof window === "undefined";

  if (isServer) {
    const session = await getServerSession(nextAuthOptions);

    if (session) {
      // request.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } else {
    const session = await getSession();

    if (session) {
      // request.headers.Authorization = `Bearer ${session.access_token}`;
    }
  }

  return request;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      signOut({ callbackUrl: "/" });
    }

    return Promise.reject(error);
  },
);

export default api;
