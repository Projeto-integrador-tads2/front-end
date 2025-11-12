import { z } from "zod";

export const kanbanCardSchema = z.object({
  title: z.string().min(1, "Título obrigatório").max(60, "Máximo 60 caracteres").optional(),
  description: z.string().max(200, "Máximo 200 caracteres").optional(),
  priority: z.enum(["Alta Prioridade", "Média Prioridade", "Baixa Prioridade"]).optional(),
  stepColumnId: z.string().min(1),
  companyId: z.string(),
});

export const kanbanColumnSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(30, "Máximo 30 caracteres"),
  color: z.string().min(1),
});

export type KanbanCardValues = z.infer<typeof kanbanCardSchema>

export type KanbanColumnValues = z.infer<typeof kanbanColumnSchema>

export type KanbanColumnMutationValues = z.infer<typeof kanbanColumnSchema> & { order: number }