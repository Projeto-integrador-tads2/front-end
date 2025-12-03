import api from "../api";
import type { CompanyDto } from "@/types/kanban";

/**
 * Fetches all companies.
 * Used for populating company selection in card creation.
 *
 * @returns Promise<CompanyDto[]> - Array of all companies
 */
export async function getAllCompanies(): Promise<CompanyDto[]> {
  const response = await api.get<CompanyDto[]>("/Company");
  return response.data;
}

/**
 * Fetches a single company by its ID.
 *
 * @param companyId - The unique identifier of the company
 * @returns Promise<CompanyDto> - The company details
 */
export async function getCompanyById(companyId: string): Promise<CompanyDto> {
  const response = await api.get<CompanyDto>(`/Company/${companyId}`);
  return response.data;
}
