import { z } from "zod";

export const serviceFormSchema = z.object({
  name: z.string().min(2, "O nome do serviço é obrigatório"),
  contractDuration: z.string().min(1, "Informe o tempo de contrato"),
  description: z.string().min(5, "A descrição é obrigatória"),
  value: z.string().min(1, "Informe o valor do serviço"),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema> & {
  files?: File[];
};
