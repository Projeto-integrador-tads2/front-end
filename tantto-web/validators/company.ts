import { z } from "zod";

export const companySchema = z.object({
  legalName: z.string().min(3, "Razão Social deve ter pelo menos 3 caracteres"),
  representativeName: z
    .string()
    .min(3, "Cliente Representante deve ter pelo menos 3 caracteres"),
  cnpj: z.string().refine((val) => val.replace(/\D/g, "").length === 14, {
    message: "CNPJ deve ter 14 dígitos",
  }),
  sector: z.enum(["Comércio", "Educação", "Indústria", "Saúde", "Serviços", "Tecnologia"], {
    message: "Selecione um setor válido",
  }),
  createdAt: z.string().min(1, "Data de Criação é obrigatória"),
  companyPicture: z.string().nullable().optional(),
});

export type CompanyFormValues = z.infer<typeof companySchema>;

