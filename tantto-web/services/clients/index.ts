import api from "../api";
import type {
  Client,
  GetAllClientsResponse,
  CreateClientDto,
  UpdateClientDto,
} from "@/types/client";

/**
 * Fetches all clients from the API.
 *
 * @returns Promise<Client[]> - Array of all clients
 */
export async function getAllClients(): Promise<Client[]> {
  const response = await api.get<GetAllClientsResponse>("/Client/all");
  return response.data.clients;
}

/**
 * Fetches a single client by its ID.
 *
 * @param clientId - The unique identifier of the client
 * @returns Promise<Client> - The client details
 */
export async function getClientById(clientId: string): Promise<Client> {
  const response = await api.get<Client>(`/Client/${clientId}`);
  return response.data;
}

/**
 * Creates a new client.
 *
 * @param data - The client creation data
 * @returns Promise<Client> - The created client
 */
export async function createClient(data: CreateClientDto): Promise<Client> {
  const response = await api.post<Client>("/Client/register", data);
  return response.data;
}

/**
 * Updates an existing client.
 *
 * @param clientId - The ID of the client to update
 * @param data - The client update data
 * @returns Promise<Client> - The updated client
 */
export async function updateClient(
  clientId: string,
  data: UpdateClientDto
): Promise<Client> {
  const response = await api.put<Client>(`/Client/update/${clientId}`, data);
  return response.data;
}

/**
 * Deletes a client.
 *
 * @param clientId - The ID of the client to delete
 * @returns Promise<void>
 */
export async function deleteClient(clientId: string): Promise<void> {
  await api.delete(`/Client/delete/${clientId}`);
}
