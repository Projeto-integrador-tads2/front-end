import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "@/services/services";
import type { Service, CreateServiceDto, UpdateServiceDto } from "@/types/service";

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
    staleTime: 1000 * 60 * 2, 
    refetchOnWindowFocus: true,
  });


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
    services,

    isLoadingServices,
    isFetchingServices,

    isErrorServices,
    servicesError,

    refetchServices,

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
