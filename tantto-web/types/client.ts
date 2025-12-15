
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

export interface GetAllClientsResponse {
  clients: Client[];
}


export interface CreateClientDto {
  name: string;
  email: string;
  phone: string;
  companyId: string;
}

export interface UpdateClientDto {
  name: string;
  email: string;
  phone: string;
}

export type CreateClientInput = CreateClientDto;

export type UpdateClientInput = UpdateClientDto & {
  clientId: string;
};
