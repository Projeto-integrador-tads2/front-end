import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "@/services/services";
import type { Service, CreateServiceDto, UpdateServiceDto } from "@/types/service";

/** Query keys for service cache management */
export const SERVICE_QUERY_KEYS = {
  all: ["services"] as const,
  byId: (id: string) => ["services", id] as const,
} as const;

/**
 * Custom hook for managing service data.
 * Provides queries and mutations for CRUD operations.
 *
 * @example
 * const {
 *   services,
 *   isLoading,
 *   createServiceMutation,
 *   updateServiceMutation,
 *   deleteServiceMutation,
 * } = useServicesData();
 */
export function useServicesData() {
  const queryClient = useQueryClient();

  // ============================================
  // QUERIES
  // ============================================

  /**
   * Fetches all services.
   */
  const {
    data: services = [],
    isLoading: isLoadingServices,
    isFetching: isFetchingServices,
    isError: isErrorServices,
    error: servicesError,
    refetch: refetchServices,
  } = useQuery<Service[]>({
    queryKey: SERVICE_QUERY_KEYS.all,
    queryFn: getAllServices,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });

  // ============================================
  // MUTATIONS
  // ============================================

  /**
   * Creates a new service.
   */
  const createServiceMutation = useMutation({
    mutationFn: async (data: CreateServiceDto) => {
      return createService(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error("Failed to create service:", error);
    },
  });

  /**
   * Updates an existing service.
   */
  const updateServiceMutation = useMutation({
    mutationFn: async ({
      serviceId,
      data,
    }: {
      serviceId: string;
      data: UpdateServiceDto;
    }) => {
      return updateService(serviceId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error("Failed to update service:", error);
    },
  });

  /**
   * Deletes a service.
   */
  const deleteServiceMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      return deleteService(serviceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error("Failed to delete service:", error);
    },
  });

  return {
    // Data
    services,

    // Loading states
    isLoadingServices,
    isFetchingServices,

    // Error states
    isErrorServices,
    servicesError,

    // Actions
    refetchServices,

    // Mutations
    createServiceMutation,
    updateServiceMutation,
    deleteServiceMutation,
  };
}

/**
 * Hook to fetch a single service by ID.
 *
 * @param serviceId - The ID of the service to fetch
 * @returns Query result with service data
 */
export function useServiceById(serviceId: string | null) {
  return useQuery<Service>({
    queryKey: SERVICE_QUERY_KEYS.byId(serviceId || ""),
    queryFn: () => getServiceById(serviceId!),
    enabled: !!serviceId,
    staleTime: 1000 * 60 * 2,
  });
}
