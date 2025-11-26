import api from "../api";
import type {
  KanbanColumnResponse,
  CompanyCardDetails,
  CreateCardInput,
  UpdateCardInput,
} from "@/types/kanban";

/**
 * Fetches all company cards grouped by their step columns.
 * This is the primary data source for rendering the Kanban board.
 *
 * @returns Promise<KanbanColumnResponse[]> - Array of columns with nested cards
 * @example
 * const columns = await getCardsGroupedByColumn();
 */
export async function getCardsGroupedByColumn(): Promise<KanbanColumnResponse[]> {
  const response = await api.get<KanbanColumnResponse[]>("/CompanyCard/cards/grouped");
  return response.data;
}

/**
 * Fetches all company cards without grouping.
 * Useful for flat list views or search functionality.
 *
 * @returns Promise<CompanyCardDetails[]> - Array of all cards
 */
export async function getAllCards(): Promise<CompanyCardDetails[]> {
  const response = await api.get<CompanyCardDetails[]>("/CompanyCard");
  return response.data;
}

/**
 * Fetches a single company card by its ID.
 *
 * @param cardId - The unique identifier of the card
 * @returns Promise<CompanyCardDetails> - The card details
 */
export async function getCardById(cardId: string): Promise<CompanyCardDetails> {
  const response = await api.get<CompanyCardDetails>(`/CompanyCard/${cardId}`);
  return response.data;
}

/**
 * Fetches all cards in a specific column.
 *
 * @param columnId - The unique identifier of the step column
 * @returns Promise<CompanyCardDetails[]> - Array of cards in the column
 */
export async function getCardsByColumnId(columnId: string): Promise<CompanyCardDetails[]> {
  const response = await api.get<CompanyCardDetails[]>(`/CompanyCard/cards/${columnId}`);
  return response.data;
}

/**
 * Creates a new company card.
 * The userId is automatically assigned by the backend from the authenticated user.
 *
 * @param input - The card creation data (companyId, stepColumnId)
 * @returns Promise<CompanyCardDetails> - The created card
 */
export async function createCard(input: CreateCardInput): Promise<CompanyCardDetails> {
  const payload = {
    companyId: input.companyId,
    stepColumnId: input.stepColumnId,
  };
  const response = await api.post<CompanyCardDetails>("/CompanyCard/register", payload);
  return response.data;
}

/**
 * Updates an existing company card.
 * Can be used to move cards between columns or reassign companies.
 *
 * @param input - The card update data including the cardId
 * @returns Promise<CompanyCardDetails> - The updated card
 */
export async function updateCard(input: UpdateCardInput): Promise<CompanyCardDetails> {
  const { companyCardId, ...payload } = input;
  const response = await api.patch<CompanyCardDetails>(
    `/CompanyCard/update/${companyCardId}`,
    payload
  );
  return response.data;
}

/**
 * Moves a card to a different column.
 * This is a convenience wrapper around updateCard for drag-and-drop operations.
 *
 * @param cardId - The ID of the card to move
 * @param targetColumnId - The ID of the target column
 * @param companyId - The company ID (required by the API)
 * @returns Promise<CompanyCardDetails> - The updated card
 */
export async function moveCardToColumn(
  cardId: string,
  targetColumnId: string,
  companyId: string
): Promise<CompanyCardDetails> {
  return updateCard({
    companyCardId: cardId,
    companyId,
    stepColumnId: targetColumnId,
  });
}

/**
 * Deletes a company card.
 *
 * @param cardId - The unique identifier of the card to delete
 * @returns Promise<void>
 */
export async function deleteCard(cardId: string): Promise<void> {
  await api.delete(`/CompanyCard/delete/${cardId}`);
}
