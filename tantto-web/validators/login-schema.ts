import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Digite um email válido"),
  password: z
     .string()
     .min(6, "A senha deve ter pelo menos 6 caracteres")
     .regex(
       /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\\/]/,
       "A senha deve conter pelo menos um caractere especial"
     ),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
