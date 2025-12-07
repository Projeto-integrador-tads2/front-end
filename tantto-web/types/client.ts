/**
 * Client types for the front-end application.
 * Maps to the backend ClientResponseDto and ClientDto.
 */

/**
 * Represents a client as returned from the API.
 * Maps to ClientResponseDto in the backend.
 */
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyId: string;
  companyName: string;
  createdAt: string;
  updatedAt: string | null;
}

/**
 * Response from GET /api/Client/all endpoint.
 */
export interface GetAllClientsResponse {
  clients: Client[];
}

/**
 * DTO for creating a new client.
 * Maps to ClientDto in the backend.
 */
export interface CreateClientDto {
  name: string;
  email: string;
  phone: string;
  companyId: string;
}

/**
 * DTO for updating an existing client.
 * Note: CompanyId is not updatable after creation based on the API.
 */
export interface UpdateClientDto {
  name: string;
  email: string;
  phone: string;
}

/**
 * Input type for creating a new client (used in mutations).
 */
export type CreateClientInput = CreateClientDto;

/**
 * Input type for updating an existing client (used in mutations).
 */
export type UpdateClientInput = UpdateClientDto & {
  clientId: string;
};
