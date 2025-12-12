import api from "../api";
import type {
  Service,
  CreateServiceDto,
  UpdateServiceDto,
} from "@/types/service";

/**
 * Fetches all services from the API.
 *
 * @returns Promise<Service[]> - Array of all services
 */
export async function getAllServices(): Promise<Service[]> {
  const response = await api.get<Service[]>("/Service");
  return response.data;
}

/**
 * Fetches a single service by its ID.
 *
 * @param serviceId - The unique identifier of the service
 * @returns Promise<Service> - The service details
 */
export async function getServiceById(serviceId: string): Promise<Service> {
  const response = await api.get<Service>(`/Service/${serviceId}`);
  return response.data;
}

/**
 * Creates a new service.
 *
 * @param data - The service creation data
 * @returns Promise<Service> - The created service
 */
export async function createService(data: CreateServiceDto): Promise<Service> {
  const response = await api.post<Service>("/Service/register", data);
  return response.data;
}

/**
 * Updates an existing service.
 *
 * @param serviceId - The ID of the service to update
 * @param data - The service update data
 * @returns Promise<Service> - The updated service
 */
export async function updateService(
  serviceId: string,
  data: UpdateServiceDto
): Promise<Service> {
  const response = await api.patch<Service>(`/Service/update/${serviceId}`, data);
  return response.data;
}

/**
 * Deletes a service.
 *
 * @param serviceId - The ID of the service to delete
 * @returns Promise<void>
 */
export async function deleteService(serviceId: string): Promise<void> {
  await api.delete(`/Service/delete/${serviceId}`);
}
