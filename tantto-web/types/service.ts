
export interface Service {
  id: string;
  name: string;
  description: string;
  contractDuration: number;
  value: number;
  servicePicture?: string | null;
}

export interface CreateServiceDto {
  name: string;
  description: string;
  contractDuration: number;
  value: number;
  servicePicture?: string | null;
}

export interface UpdateServiceDto {
  name: string;
  description: string;
  contractDuration: number;
  value: number;
  servicePicture?: string | null;
}

export type CreateServiceInput = CreateServiceDto;

export type UpdateServiceInput = UpdateServiceDto & {
  serviceId: string;
};