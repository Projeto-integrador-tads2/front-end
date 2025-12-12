import { z } from "zod";

export const serviceFormSchema = z.object({
  title: z.string().min(2, "O nome do serviço é obrigatório"),
  contractTime: z.string().min(1, "Informe o tempo de contrato"),
  description: z.string().min(5, "A descrição é obrigatória"),
  price: z.string().min(1, "Informe o valor do serviço"),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema> & {
  files?: File[];
};
