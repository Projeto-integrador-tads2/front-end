import api from "../api";
import type {
  StepColumnDto,
  CreateColumnInput,
  UpdateColumnInput,
} from "@/types/kanban";

/**
 * Fetches all step columns.
 * Columns are returned in their defined order.
 *
 * @returns Promise<StepColumnDto[]> - Array of all columns
 */
export async function getAllColumns(): Promise<StepColumnDto[]> {
  const response = await api.get<StepColumnDto[]>("/StepColumn");
  return response.data;
}

/**
 * Fetches a single step column by its ID.
 *
 * @param columnId - The unique identifier of the column
 * @returns Promise<StepColumnDto> - The column details
 */
export async function getColumnById(columnId: string): Promise<StepColumnDto> {
  const response = await api.get<StepColumnDto>(`/StepColumn/${columnId}`);
  return response.data;
}

/**
 * Creates a new step column.
 *
 * @param input - The column creation data (name, order, color)
 * @returns Promise<StepColumnDto> - The created column
 * @example
 * const newColumn = await createColumn({
 *   name: "Em Progresso",
 *   order: 2,
 *   color: "#3B82F6"
 * });
 */
export async function createColumn(input: CreateColumnInput): Promise<StepColumnDto> {
  const payload = {
    name: input.name,
    order: input.order,
    color: input.color,
  };
  const response = await api.post<StepColumnDto>("/StepColumn/register", payload);
  return response.data;
}

/**
 * Updates an existing step column.
 * Note: The order cannot be changed through this endpoint (per backend design).
 *
 * @param input - The column update data including the columnId
 * @returns Promise<StepColumnDto> - The updated column
 */
export async function updateColumn(input: UpdateColumnInput): Promise<StepColumnDto> {
  const { id, ...payload } = input;
  const response = await api.patch<StepColumnDto>(`/StepColumn/update/${id}`, payload);
  return response.data;
}

/**
 * Deletes a step column.
 * Warning: This may affect cards in the column - handle with care.
 *
 * @param columnId - The unique identifier of the column to delete
 * @returns Promise<void>
 */
export async function deleteColumn(columnId: string): Promise<void> {
  await api.delete(`/StepColumn/delete/${columnId}`);
}
