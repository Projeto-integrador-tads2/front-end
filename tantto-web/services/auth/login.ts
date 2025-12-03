import api from "../api";

import { LoginData } from "@/validators/login-schema";
import { LoginResponse } from "@/types/auth";
import { AxiosResponse } from "axios";

export async function Login(
  data: LoginData
): Promise<AxiosResponse<LoginResponse>> {
  return await api.post<LoginResponse>(`Auth/login`, data);
}
