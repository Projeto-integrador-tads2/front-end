import api from "../api";

import { LoginData } from "@/validators/login-schema";

export async function Login(data: LoginData): Promise<any> {
  return await api.post(`api/Auth/login`, data);
}
