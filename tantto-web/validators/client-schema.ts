import { z } from "zod";


export const clientFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .min(8, "Telefone deve ter pelo menos 8 dígitos")
    .max(20, "Telefone deve ter no máximo 20 caracteres"),
  companyId: z
    .string()
    .min(1, "Empresa é obrigatória"),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

export const clientUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .min(8, "Telefone deve ter pelo menos 8 dígitos")
    .max(20, "Telefone deve ter no máximo 20 caracteres"),
});

export type ClientUpdateFormValues = z.infer<typeof clientUpdateSchema>;
