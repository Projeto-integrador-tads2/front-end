import api from "../api";
import type {
  StepColumnDto,
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

