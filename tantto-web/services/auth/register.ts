// src/services/auth/register.ts

import api from "@/services/api"; 
import type { AxiosError } from "axios";

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  response: {
    message: string;
    email: string;
    name: string;
    userId: string;
  }
  success: boolean;
}

export async function registerUser(data: RegisterData): Promise<RegisterResponse> {
  try {
    const response = await api.post("/Auth/register", data); 

    return {
        success: true,
        response: response.data,
    }
  } catch (error: any) {

    let message = "Erro ao criar usuário";
    const stringError = String(error.response?.data);
    if (stringError.includes("Email já cadastrado")) {
      message = "Email já cadastrado";
    } else if (error.response?.data?.errors) {
      message = Object.values(error.response.data.errors).flat().join(", ");
    }

    throw new Error(message);
  }
}