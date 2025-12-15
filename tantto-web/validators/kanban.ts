/**
 * Kanban Form Validators
 *
 * Zod schemas for validating Kanban-related form inputs.
 * Used with react-hook-form for form validation.
 *
 * @module validators/kanban
 */

import { z } from "zod";

export const kanbanCardSchema = z.object({
  title: z.string().min(1, "Título obrigatório").max(60, "Máximo 60 caracteres").optional(),
  description: z.string().max(200, "Máximo 200 caracteres").optional(),
  priority: z.enum(["Alta Prioridade", "Média Prioridade", "Baixa Prioridade"]).optional(),
  stepColumnId: z.string().min(1, "Coluna obrigatória"),
  companyId: z.string().min(1, "Empresa obrigatória"),
});

export const kanbanColumnSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(30, "Máximo 30 caracteres"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor deve estar no formato #RRGGBB"),
});

export const kanbanColumnCreateSchema = kanbanColumnSchema.extend({
  order: z.number().min(1, "Ordem deve ser maior que 0"),
});


export type KanbanCardValues = z.infer<typeof kanbanCardSchema>;

export type KanbanColumnValues = z.infer<typeof kanbanColumnSchema>;

export type KanbanColumnMutationValues = z.infer<typeof kanbanColumnCreateSchema>;