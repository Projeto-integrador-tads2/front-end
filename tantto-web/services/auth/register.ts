// src/services/auth/register.ts

import api from "@/services/api"; // ← usa a api com token (autenticada)

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: string;
}

export async function registerUser(data: RegisterData): Promise<RegisterResponse> {
  console.log("🔧 Criando novo usuário (área privada)...");
  console.log("📤 Dados enviados:", data);

  try {
    const response = await api.post("/Auth/register", data); // ← usa api autenticada

    console.log("✅ Usuário criado com sucesso!");
    console.log("📄 Resposta:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("💥 Erro ao criar usuário:");
    console.error("Status:", error.response?.status);
    console.error("Dados do erro:", error.response?.data);

    let message = "Erro ao criar usuário";
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.response?.data?.errors) {
      message = Object.values(error.response.data.errors).flat().join(", ");
    }

    throw new Error(message);
  }
}