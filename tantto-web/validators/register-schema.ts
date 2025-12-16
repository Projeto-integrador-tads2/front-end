import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .min(10, "Telefone deve ter no mínimo 10 números")
    .max(11, "Telefone deve ter no máximo 11 números")
    .regex(/^\d+$/, "Telefone deve conter apenas números"),
  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial"),
});

export type RegisterData = z.infer<typeof registerSchema>;
