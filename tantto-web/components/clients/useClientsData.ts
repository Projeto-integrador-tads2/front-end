import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from "@/services/clients";
import { getAllCompanies } from "@/services/kanban/companies";
import type { Client, CreateClientDto, UpdateClientDto } from "@/types/client";
import type { CompanyDto } from "@/types/kanban";
import {
  handleMutationSuccess,
  handleMutationError,
} from "@/lib/toast-utils";

/** Query keys for client cache management */
export const CLIENT_QUERY_KEYS = {
  all: ["clients"] as const,
  byId: (id: string) => ["clients", id] as const,
  companies: ["companies"] as const,
} as const;

/**
 * Custom hook for managing client data.
 * Provides queries and mutations for CRUD operations.
 *
 * @example
 * const {
 *   clients,
 *   companies,
 *   isLoading,
 *   createClientMutation,
 *   updateClientMutation,
 *   deleteClientMutation,
 * } = useClientsData();
 */
export function useClientsData() {
  const queryClient = useQueryClient();

  // ============================================
  // QUERIES
  // ============================================

  /**
   * Fetches all clients.
   */
  const {
    data: clients = [],
    isLoading: isLoadingClients,
    isFetching: isFetchingClients,
    isError: isErrorClients,
    error: clientsError,
    refetch: refetchClients,
  } = useQuery<Client[]>({
    queryKey: CLIENT_QUERY_KEYS.all,
    queryFn: getAllClients,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });

  /**
   * Fetches all companies for the select dropdown.
   */
  const {
    data: companies = [],
    isLoading: isLoadingCompanies,
    isError: isErrorCompanies,
  } = useQuery<CompanyDto[]>({
    queryKey: CLIENT_QUERY_KEYS.companies,
    queryFn: getAllCompanies,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // ============================================
  // MUTATIONS
  // ============================================

  /**
   * Creates a new client.
   */
  const createClientMutation = useMutation({
    mutationFn: async (data: CreateClientDto) => {
      return createClient(data);
    },
    onSuccess: (data) => {
      handleMutationSuccess(data, "Cliente criado com sucesso!", "create-client");
      queryClient.invalidateQueries({ queryKey: CLIENT_QUERY_KEYS.all });
    },
    onError: (error) => {
      handleMutationError(error, "Erro ao criar cliente. Tente novamente.", "create-client");
      console.error("Failed to create client:", error);
    },
  });

  /**
   * Updates an existing client.
   */
  const updateClientMutation = useMutation({
    mutationFn: async ({
      clientId,
      data,
    }: {
      clientId: string;
      data: UpdateClientDto;
    }) => {
      return updateClient(clientId, data);
    },
    onSuccess: (data) => {
      handleMutationSuccess(data, "Cliente atualizado com sucesso!", "update-client");
      queryClient.invalidateQueries({ queryKey: CLIENT_QUERY_KEYS.all });
    },
    onError: (error) => {
      handleMutationError(error, "Erro ao atualizar cliente. Tente novamente.", "update-client");
      console.error("Failed to update client:", error);
    },
  });

  /**
   * Deletes a client.
   */
  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      return deleteClient(clientId);
    },
    onSuccess: () => {
      handleMutationSuccess(null, "Cliente excluído com sucesso!", "delete-client");
      queryClient.invalidateQueries({ queryKey: CLIENT_QUERY_KEYS.all });
    },
    onError: (error) => {
      handleMutationError(error, "Erro ao excluir cliente. Tente novamente.", "delete-client");
      console.error("Failed to delete client:", error);
    },
  });

  return {
    // Data
    clients,
    companies,

    // Loading states
    isLoadingClients,
    isFetchingClients,
    isLoadingCompanies,

    // Error states
    isErrorClients,
    isErrorCompanies,
    clientsError,

    // Actions
    refetchClients,

    // Mutations
    createClientMutation,
    updateClientMutation,
    deleteClientMutation,
  };
}

/**
 * Hook to fetch a single client by ID.
 *
 * @param clientId - The ID of the client to fetch
 * @returns Query result with client data
 */
export function useClientById(clientId: string | null) {
  return useQuery<Client>({
    queryKey: CLIENT_QUERY_KEYS.byId(clientId || ""),
    queryFn: () => getClientById(clientId!),
    enabled: !!clientId,
    staleTime: 1000 * 60 * 2,
  });
}
