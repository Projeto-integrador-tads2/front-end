// Criar Company

export interface CreateCompanyResponse {
  companyId: string;
  name: string;
  cnpj: string;
  sector?: string;
  companyPicture?: string | null;
  message: string;
}

export interface CreateCompanyRequest{
  name: string;
  cnpj: string;
  sector?: string;
  companyPicture?: string | null;
}

// Get 

export interface Company{
  companyId: string;
  name: string;
  cnpj: string;
  representativeName: string;
  createdAt: string;
  sector?: string;
  companyPicture?: string | null;
}

export type CompaniesListResponse = Company[]

export type UpdateCompanyRequest = Partial<CreateCompanyRequest>; // Type x Interface

export interface UpdateCompanyResponse{
  companyId: string;
  message: string;
}

export interface DeleteCompanyResponse{
  success: boolean;
  message: string;
}

