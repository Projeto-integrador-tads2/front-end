import { createCompanyCard } from "@/services/kanban/create-company-card";
import { createStepColumn } from "@/services/kanban/create-step-column";
import { getAllColumns } from "@/services/kanban/get-all-columns";
import { KanbanCardValues, KanbanColumnMutationValues, KanbanColumnValues } from "@/validators/kanban";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";

export type KanbanPriority = "Alta Prioridade" | "Média Prioridade" | "Baixa Prioridade";

export type KanbanCard = {
  id: string;
  name: string; // Para compatibilidade com KanbanItemProps
  title: string;
  description: string;
  priority: KanbanPriority;
  column: string; // Para compatibilidade com KanbanItemProps
  stepColumnId: string;
  avatars: string[];
};

export type KanbanColumn = {
  id: string;
  name: string;
  color: string;
  cards: KanbanCard[];
};

export function useKanbanData() {
  const queryClient = useQueryClient();

  const { data: columns = [], isLoading: isLoadingColumns, isFetching: isFetchingColumns, isError: isErrorColumns } = useQuery<KanbanColumn[]>({
    queryKey: ["kanban-columns"],
    queryFn: () => getAllColumns(),
  });

  const addCard = useMutation({
    mutationFn: async (card: KanbanCardValues) => {
      // Garantir campos obrigatórios para KanbanItemProps
      const newCard = {
        // name: card.title,
        stepColumnId: card.stepColumnId,
        companyId: card.companyId,
        // description: card.description || "",
      };

      console.log("Creating card with data:", newCard);
      return createCompanyCard(newCard);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanban-columns"] });
    }
  });

  const addColumn = useMutation({
    mutationFn: async (column: KanbanColumnMutationValues) => {
      return await createStepColumn(column);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanban-columns"] });
    }
  });

  // ...implement edit/remove as needed

  return {
    columns,
    addCard,
    addColumn,
    isLoadingColumns,
    isFetchingColumns,
    isErrorColumns,
  };
}
