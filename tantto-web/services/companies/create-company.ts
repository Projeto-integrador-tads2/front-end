import api from "../api";
import type {
  CreateCompanyRequest,
  CreateCompanyResponse,
} from "@/types/company";

export const createCompany = async (
  payload: CreateCompanyRequest
): Promise<CreateCompanyResponse> => {
  try {
    const res = await api.post<CreateCompanyResponse>(
      "Company/register",
      payload
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
