/**
 * Service types for the front-end application.
 * Maps to the backend ServiceDto and related DTOs.
 */

/**
 * Represents a service as returned from the API.
 * Maps to ServiceDto in the backend.
 */
export interface Service {
  id: string;
  name: string;
  description: string;
  contractDuration: number;
  value: number;
  servicePicture?: string | null;
}

/**
 * DTO for creating a new service.
 * Maps to RegisterServiceDto in the backend.
 */
export interface CreateServiceDto {
  name: string;
  description: string;
  contractDuration: number;
  value: number;
  servicePicture?: string | null;
}

/**
 * DTO for updating an existing service.
 * Maps to UpdateServiceDto in the backend.
 */
export interface UpdateServiceDto {
  name: string;
  description: string;
  contractDuration: number;
  value: number;
  servicePicture?: string | null;
}

/**
 * Input type for creating a new service (used in mutations).
 */
export type CreateServiceInput = CreateServiceDto;

/**
 * Input type for updating an existing service (used in mutations).
 */
export type UpdateServiceInput = UpdateServiceDto & {
  serviceId: string;
};