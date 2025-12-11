import {
  getCardsGroupedByColumn,
  createCard,
  updateCard,
  deleteCard,
  moveCardToColumn,
  getAllCompanies,
} from "@/services/kanban";
import type {
  KanbanColumn as KanbanColumnType,
  KanbanCard as KanbanCardType,
  KanbanColumnResponse,
  CreateCardInput,
  UpdateCardInput,
  CompanyDto,
  KanbanPriority,
} from "@/types/kanban";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  handleMutationSuccess,
  handleMutationError,
  toastError,
} from "@/lib/toast-utils";

// Re-export types for backward compatibility
export type { KanbanPriority } from "@/types/kanban";
export type KanbanCard = KanbanCardType;
export type KanbanColumn = KanbanColumnType;

/** Query keys for cache management */
export const KANBAN_QUERY_KEYS = {
  columns: ["kanban-columns"] as const,
  companies: ["kanban-companies"] as const,
  cards: ["kanban-cards"] as const,
} as const;

/**
 * Transforms API response to front-end KanbanColumn format.
 * Maps CompanyCardDetails to enriched KanbanCard objects.
 *
 * @param apiColumns - Raw API response from getCardsGroupedByColumn
 * @returns Transformed columns with enriched card data
 */
function transformApiResponse(apiColumns: KanbanColumnResponse[]): KanbanColumn[] {
  return apiColumns.map((column) => ({
    id: column.id,
    name: column.name,
    color: column.color,
    cards: (column.cards || []).map((card): KanbanCard => ({
      id: card.id,
      name: card.companyName || "Sem nome",
      title: card.companyName || "Sem título",
      description: `Responsável: ${card.userName || "Não atribuído"}`,
      priority: "Média Prioridade" as KanbanPriority,
      column: column.name,
      stepColumnId: card.stepColumnId,
      companyId: card.companyId,
      companyName: card.companyName,
      userId: card.userId,
      userName: card.userName,
      avatars: [],
    })),
  }));
}

/**
 * Main Kanban data hook.
 * Provides all data and mutations needed for the Kanban board.
 *
 * @returns Object containing columns data, companies, loading states, and mutation functions
 *
 * @example
 * const {
 *   columns,
 *   companies,
 *   addCard,
 *   moveCard,
 *   isLoadingColumns,
 * } = useKanbanData();
 *
 * // Create a new card
 * addCard.mutate({ companyId: "...", stepColumnId: "..." });
 *
 * // Move card to another column
 * moveCard.mutate({ cardId: "...", targetColumnId: "...", companyId: "..." });
 */
export function useKanbanData() {
  const queryClient = useQueryClient();

  // ============================================
  // QUERIES
  // ============================================

  /**
   * Fetches columns with grouped cards.
   * This is the primary data source for the Kanban board.
   */
  const {
    data: columns = [],
    isLoading: isLoadingColumns,
    isFetching: isFetchingColumns,
    isError: isErrorColumns,
    error: columnsError,
    refetch: refetchColumns,
  } = useQuery<KanbanColumn[]>({
    queryKey: KANBAN_QUERY_KEYS.columns,
    queryFn: async () => {
      const apiData = await getCardsGroupedByColumn();
      return transformApiResponse(apiData);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });

  /**
   * Fetches all companies for card creation.
   */
  const {
    data: companies = [],
    isLoading: isLoadingCompanies,
    isError: isErrorCompanies,
  } = useQuery<CompanyDto[]>({
    queryKey: KANBAN_QUERY_KEYS.companies,
    queryFn: getAllCompanies,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // ============================================
  // CARD MUTATIONS
  // ============================================

  /**
   * Creates a new card in the specified column.
   */
  const addCard = useMutation({
    mutationFn: async (input: CreateCardInput) => {
      return createCard(input);
    },
    onSuccess: (data) => {
      handleMutationSuccess(data, "Card criado com sucesso!", "create-card");
      queryClient.invalidateQueries({ queryKey: KANBAN_QUERY_KEYS.columns });
    },
    onError: (error) => {
      handleMutationError(error, "Erro ao criar card. Tente novamente.", "create-card");
      console.error("Failed to create card:", error);
    },
  });

  /**
   * Updates an existing card.
   */
  const editCard = useMutation({
    mutationFn: async (input: UpdateCardInput) => {
      return updateCard(input);
    },
    onSuccess: (data) => {
      handleMutationSuccess(data, "Card atualizado com sucesso!", "update-card");
      queryClient.invalidateQueries({ queryKey: KANBAN_QUERY_KEYS.columns });
    },
    onError: (error) => {
      handleMutationError(error, "Erro ao atualizar card. Tente novamente.", "update-card");
      console.error("Failed to update card:", error);
    },
  });

  /**
   * Moves a card to a different column.
   * Includes optimistic update for smooth drag-and-drop UX.
   */
  const moveCard = useMutation({
    mutationFn: async ({
      cardId,
      targetColumnId,
      companyId,
    }: {
      cardId: string;
      targetColumnId: string;
      companyId: string;
    }) => {
      return moveCardToColumn(cardId, targetColumnId, companyId);
    },
    // Optimistic update for immediate visual feedback
    onMutate: async ({ cardId, targetColumnId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: KANBAN_QUERY_KEYS.columns });

      // Snapshot previous value
      const previousColumns = queryClient.getQueryData<KanbanColumn[]>(
        KANBAN_QUERY_KEYS.columns
      );

      // Optimistically update
      if (previousColumns) {
        const newColumns = previousColumns.map((column) => {
          const card = column.cards.find((c) => c.id === cardId);
          if (card) {
            // Remove from current column
            return {
              ...column,
              cards: column.cards.filter((c) => c.id !== cardId),
            };
          }
          if (column.id === targetColumnId) {
            // Find the card from any column and add to target
            const movedCard = previousColumns
              .flatMap((col) => col.cards)
              .find((c) => c.id === cardId);
            if (movedCard) {
              return {
                ...column,
                cards: [
                  ...column.cards,
                  { ...movedCard, stepColumnId: targetColumnId, column: column.name },
                ],
              };
            }
          }
          return column;
        });
        queryClient.setQueryData(KANBAN_QUERY_KEYS.columns, newColumns);
      }

      return { previousColumns };
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousColumns) {
        queryClient.setQueryData(KANBAN_QUERY_KEYS.columns, context.previousColumns);
      }
      toastError("Erro ao mover card. Tente novamente.", "move-card");
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: KANBAN_QUERY_KEYS.columns });
    },
  });

  /**
   * Removes a card from the board.
   */
  const removeCard = useMutation({
    mutationFn: async (cardId: string) => {
      return deleteCard(cardId);
    },
    // Optimistic update
    onMutate: async (cardId) => {
      await queryClient.cancelQueries({ queryKey: KANBAN_QUERY_KEYS.columns });
      const previousColumns = queryClient.getQueryData<KanbanColumn[]>(
        KANBAN_QUERY_KEYS.columns
      );

      if (previousColumns) {
        const newColumns = previousColumns.map((column) => ({
          ...column,
          cards: column.cards.filter((card) => card.id !== cardId),
        }));
        queryClient.setQueryData(KANBAN_QUERY_KEYS.columns, newColumns);
      }

      return { previousColumns };
    },
    onError: (_error, _cardId, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(KANBAN_QUERY_KEYS.columns, context.previousColumns);
      }
      toastError("Erro ao excluir card. Tente novamente.", "delete-card");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: KANBAN_QUERY_KEYS.columns });
    },
  });


  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  /**
   * Flattens all cards from all columns into a single array.
   * Useful for search and filtering operations.
   */
  const allCards = columns.flatMap((column) => column.cards);

  /**
   * Gets cards count for a specific column.
   */
  const getColumnCardsCount = (columnId: string): number => {
    const column = columns.find((col) => col.id === columnId);
    return column?.cards.length ?? 0;
  };

  /**
   * Gets the total count of all cards.
   */
  const totalCardsCount = allCards.length;

  return {
    // Data
    columns,
    companies,
    allCards,
    totalCardsCount,

    // Loading states
    isLoadingColumns,
    isFetchingColumns,
    isErrorColumns,
    columnsError,
    isLoadingCompanies,
    isErrorCompanies,

    // Card mutations
    addCard,
    editCard,
    moveCard,
    removeCard,

    // Column mutation (only update allowed)

    // Helpers
    getColumnCardsCount,
    refetchColumns,
  };
}
