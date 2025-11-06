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
  columnId: string;
  avatars: string[];
};

export type KanbanColumn = {
  id: string;
  name: string;
  color: string;
};

const initialColumns: KanbanColumn[] = [
  { id: "perfil", name: "Análise de Perfil", color: "#3B82F6" },
  { id: "cliente", name: "Conversa com o Cliente", color: "#FBBF24" },
  { id: "negociacao", name: "Negociação", color: "#22C55E" },
];

const initialCards: KanbanCard[] = [
  {
    id: nanoid(),
    name: "Empresa Tal",
    title: "Empresa Tal",
    description: "Lorem ipsum dolor sit amet, libre unst consectetur adipiscing elit.",
    priority: "Alta Prioridade",
    column: "perfil",
    columnId: "perfil",
    avatars: ["/avatars/1.png", "/avatars/2.png"],
  },
  {
    id: nanoid(),
    name: "Empreendimento tal",
    title: "Empreendimento tal",
    description: "Lorem ipsum dolor sit amet, libre unst consectetur adipiscing elit.",
    priority: "Alta Prioridade",
    column: "perfil",
    columnId: "perfil",
    avatars: ["/avatars/3.png", "/avatars/4.png", "/avatars/5.png", "/avatars/6.png"],
  },
  {
    id: nanoid(),
    name: "Resolver o chamado Orteca",
    title: "Resolver o chamado Orteca",
    description: "Lorem ipsum dolor sit amet, libre unst consectetur adipiscing elit.",
    priority: "Média Prioridade",
    column: "perfil",
    columnId: "perfil",
    avatars: ["/avatars/7.png", "/avatars/8.png"],
  },
  {
    id: nanoid(),
    name: "Resolução do Chamado nº 774",
    title: "Resolução do Chamado nº 774",
    description: "Lorem ipsum dolor sit amet, libre unst consectetur adipiscing elit.",
    priority: "Alta Prioridade",
    column: "cliente",
    columnId: "cliente",
    avatars: ["/avatars/9.png"],
  },
  {
    id: nanoid(),
    name: "Healthcare app wireframe flow",
    title: "Healthcare app wireframe flow",
    description: "Lorem ipsum dolor sit amet, libre unst consectetur adipiscing elit.",
    priority: "Alta Prioridade",
    column: "cliente",
    columnId: "cliente",
    avatars: ["/avatars/3.png", "/avatars/4.png", "/avatars/5.png", "/avatars/6.png"],
  },
  {
    id: nanoid(),
    name: "UI/UX Design in the age of AI",
    title: "UI/UX Design in the age of AI",
    description: "Lorem ipsum dolor sit amet, libre unst consectetur adipiscing elit.",
    priority: "Baixa Prioridade",
    column: "negociacao",
    columnId: "negociacao",
    avatars: ["/avatars/10.png", "/avatars/11.png"],
  },
  {
    id: nanoid(),
    name: "UI/UX Design in the age of AI",
    title: "UI/UX Design in the age of AI",
    description: "Lorem ipsum dolor sit amet, libre unst consectetur adipiscing elit.",
    priority: "Baixa Prioridade",
    column: "negociacao",
    columnId: "negociacao",
    avatars: ["/avatars/12.png", "/avatars/13.png", "/avatars/14.png"],
  },
  {
    id: nanoid(),
    name: "UI/UX Design in the age of AI",
    title: "UI/UX Design in the age of AI",
    description: "Lorem ipsum dolor sit amet, libre unst consectetur adipiscing elit.",
    priority: "Média Prioridade",
    column: "negociacao",
    columnId: "negociacao",
    avatars: ["/avatars/15.png", "/avatars/16.png"],
  },
{
    id: nanoid(),
    name: "UI/UX Design in the age of AI",
    title: "UI/UX Design in the age of AI",
    description: "Lorem ipsum dolor sit amet, libre unst consectetur adipiscing elit.",
    priority: "Média Prioridade",
    column: "negociacao",
    columnId: "negociacao",
    avatars: ["/avatars/15.png", "/avatars/16.png"],
  },

];

export function useKanbanData() {
  const queryClient = useQueryClient();

  const { data: columns = initialColumns } = useQuery<KanbanColumn[]>({
    queryKey: ["kanban-columns"],
    queryFn: () => initialColumns,
    staleTime: Infinity,
  });

  const { data: cards = initialCards } = useQuery<KanbanCard[]>({
    queryKey: ["kanban-cards"],
    queryFn: () => initialCards,
    staleTime: Infinity,
  });

  const addCard = useMutation({
    mutationFn: async (card: Omit<KanbanCard, "id">) => {
      // Garantir campos obrigatórios para KanbanItemProps
      const newCard = {
        ...card,
        id: nanoid(),
        name: card.title,
        column: card.columnId,
        description: card.description || "",
      };
      queryClient.setQueryData<KanbanCard[]>(["kanban-cards"], (old = []) => [
        ...old,
        newCard,
      ]);
      return Promise.resolve(newCard);
    },
  });

  const addColumn = useMutation({
    mutationFn: async (column: Omit<KanbanColumn, "id">) => {
      const newColumn = { ...column, id: nanoid() };
      queryClient.setQueryData<KanbanColumn[]>(["kanban-columns"], (old = []) => [
        ...old,
        newColumn,
      ]);
      return Promise.resolve(newColumn);
    },
  });

  // ...implement edit/remove as needed

  return {
    columns,
    cards,
    addCard,
    addColumn,
  };
}
