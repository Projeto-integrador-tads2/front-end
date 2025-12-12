import { z } from "zod";

/**
 * Zod schema for service form validation.
 * Used for both create and edit operations.
 */
export const serviceFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nome do serviço é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .min(5, "Descrição deve ter pelo menos 5 caracteres")
    .max(500, "Descrição deve ter no máximo 500 caracteres"),
  contractDuration: z
    .number()
    .min(1, "Duração do contrato deve ser pelo menos 1 mês")
    .int("Duração deve ser um número inteiro"),
  value: z
    .number()
    .min(0, "Valor deve ser maior ou igual a zero"),
  servicePicture: z.string().optional().nullable(),
});

/**
 * Inferred type from the service form schema.
 */
export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
