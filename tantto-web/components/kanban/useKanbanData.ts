import {
  getCardsGroupedByColumn,
  createCard,
  updateCard,
  deleteCard,
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

export type { KanbanPriority } from "@/types/kanban";
export type KanbanCard = KanbanCardType;
export type KanbanColumn = KanbanColumnType;

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
    order: column.order || 0,
    cards: (column.cards || []).map((card): KanbanCard => ({
      id: card.id,
      name: card.name || "",
      title: card.name || "",
      description: card.description || "",
      priority: card.priority as KanbanPriority,
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
    staleTime: 1000 * 60 * 2, 
    refetchOnWindowFocus: true,
  });

  const {
    data: companies = [],
    isLoading: isLoadingCompanies,
    isError: isErrorCompanies,
  } = useQuery<CompanyDto[]>({
    queryKey: KANBAN_QUERY_KEYS.companies,
    queryFn: getAllCompanies,
    staleTime: 1000 * 60 * 5,
  });
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
    },
  });

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
    },
  });

  const moveCard = useMutation({
    mutationFn: async (input: UpdateCardInput) => {
      const result = await updateCard(input);
      return result;
    },
    onMutate: async (input) => {
      const { companyCardId: cardId, stepColumnId: targetColumnId } = input;

      await queryClient.cancelQueries({ queryKey: KANBAN_QUERY_KEYS.columns });

      const previousColumns = queryClient.getQueryData<KanbanColumn[]>(
        KANBAN_QUERY_KEYS.columns
      );

      if (previousColumns) {
        const cardToMove = previousColumns
          .flatMap((col) => col.cards)
          .find((c) => c.id === cardId);

        if (cardToMove) {
          const newColumns = previousColumns.map((column) => {
            const cardsWithoutMoved = column.cards.filter((c) => c.id !== cardId);

            if (column.id === targetColumnId) {
              return {
                ...column,
                cards: [
                  ...cardsWithoutMoved,
                  {
                    ...cardToMove,
                    stepColumnId: targetColumnId,
                    column: column.name,
                    ...(input.name && { name: input.name, title: input.name }),
                    ...(input.description && { description: input.description }),
                    ...(input.priority && { priority: input.priority }),
                  },
                ],
              };
            }

            return {
              ...column,
              cards: cardsWithoutMoved,
            };
          });
          queryClient.setQueryData(KANBAN_QUERY_KEYS.columns, newColumns);
        }
      }

      return { previousColumns };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(KANBAN_QUERY_KEYS.columns, context.previousColumns);
      }
      toastError("Erro ao mover card. Tente novamente.", "move-card");
    },
  });

  const removeCard = useMutation({
    mutationFn: async (cardId: string) => {
      return deleteCard(cardId);
    },
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

  const allCards = columns.flatMap((column) => column.cards);

  const getColumnCardsCount = (columnId: string): number => {
    const column = columns.find((col) => col.id === columnId);
    return column?.cards.length ?? 0;
  };

  const totalCardsCount = allCards.length;

  return {
    columns: [...columns].sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0)),
    companies,
    allCards,
    totalCardsCount,

    isLoadingColumns,
    isFetchingColumns,
    isErrorColumns,
    columnsError,
    isLoadingCompanies,
    isErrorCompanies,

    addCard,
    editCard,
    moveCard,
    removeCard,

    getColumnCardsCount,
    refetchColumns,
  };
}
