/**
 * Priority levels for Kanban cards.
 * Used for visual distinction and filtering.
 */
export type KanbanPriority = "Alta Prioridade" | "Média Prioridade" | "Baixa Prioridade";

/**
 * Represents the detailed card data returned from the API.
 * Maps to CompanyCardDetailsDto in the backend.
 */
export interface CompanyCardDetails {
  id: string;
  userId: string;
  userName: string | null;
  companyId: string;
  companyName: string | null;
  stepColumnId: string;
  stepColumnName: string | null;
}

/**
 * Represents a simplified card DTO for create/update operations.
 * Maps to CompanyCardDto in the backend.
 */
export interface CompanyCardDto {
  userId?: string;
  companyId: string;
  stepColumnId: string;
}

/**
 * Represents the grouped column response from the API.
 * Maps to CompanyCardsByColumnDto in the backend.
 */
export interface KanbanColumnResponse {
  id: string;
  name: string;
  color: string;
  cards: CompanyCardDetails[];
}

/**
 * Represents a Step Column DTO.
 * Maps to StepColumnDto in the backend.
 */
export interface StepColumnDto {
  id?: string;
  name: string;
  order: number;
  color: string;
  isActive?: boolean;
}

/**
 * Represents a Company DTO.
 * Maps to CompanyDto in the backend.
 */
export interface CompanyDto {
  companyId: string;
  name: string;
  cnpj: string;
  companyPicture?: string | null;
}

/**
 * Enriched Kanban card type for front-end use.
 * Extends API data with computed/display properties.
 */
export interface KanbanCard {
  id: string;
  name: string;
  title: string;
  description: string;
  priority: KanbanPriority;
  column: string;
  stepColumnId: string;
  companyId: string;
  companyName: string | null;
  userId: string;
  userName: string | null;
  avatars: string[];
  [key: string]: unknown;
}

/**
 * Enriched Kanban column type for front-end use.
 * Includes nested cards array for rendering.
 */
export interface KanbanColumn {
  id: string;
  name: string;
  color: string;
  order?: number;
  isActive?: boolean;
  cards: KanbanCard[];
  [key: string]: unknown;
}

/**
 * Input type for creating a new card.
 */
export interface CreateCardInput {
  companyId: string;
  stepColumnId: string;
}

/**
 * Input type for updating an existing card.
 */
export interface UpdateCardInput {
  companyCardId: string;
  userId?: string;
  companyId: string;
  stepColumnId: string;
}

/**
 * Input type for creating a new column.
 */
export interface CreateColumnInput {
  name: string;
  order: number;
  color: string;
}

/**
 * Input type for updating an existing column.
 */
export interface UpdateColumnInput {
  id: string;
  name: string;
  color: string;
}

/**
 * Input type for moving a card between columns.
 */
export interface MoveCardInput {
  companyCardId: string;
  targetColumnId: string;
}

/**
 * API response wrapper type.
 * Used for consistent API response handling.
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}
