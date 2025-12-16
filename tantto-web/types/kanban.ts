
export type KanbanPriority = "Alta Prioridade" | "Média Prioridade" | "Baixa Prioridade";

export interface CompanyCardDetails {
  id: string;
  userId: string;
  userName: string | null;
  name: string | null;
  priority: KanbanPriority;
  description: string | null;
  companyId: string;
  companyName: string | null;
  stepColumnId: string;
  stepColumnName: string | null;
}

export interface CompanyCardDto {
  userId?: string;
  companyId: string;
  stepColumnId: string;
}

export interface KanbanColumnResponse {
  id: string;
  name: string;
  color: string;
  order: number;
  cards: CompanyCardDetails[];
}

export interface StepColumnDto {
  id?: string;
  name: string;
  order: number;
  color: string;
  isActive?: boolean;
}

export interface CompanyDto {
  companyId: string;
  name: string;
  cnpj: string;
  companyPicture?: string | null;
}

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

export interface KanbanColumn {
  id: string;
  name: string;
  color: string;
  order?: number;
  isActive?: boolean;
  cards: KanbanCard[];
  [key: string]: unknown;
}

export interface CreateCardInput {
  name: string;
  priority: KanbanPriority;
  description: string;
  companyId: string;
  stepColumnId: string;
}

export interface UpdateCardInput {
  companyCardId: string;
  userId?: string;
  name: string;
  priority: KanbanPriority;
  description: string;
  companyId: string;
  stepColumnId: string;
}

export interface CreateColumnInput {
  name: string;
  order: number;
  color: string;
}

export interface UpdateColumnInput {
  id: string;
  name: string;
  color: string;
}

export interface MoveCardInput {
  companyCardId: string;
  targetColumnId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}
