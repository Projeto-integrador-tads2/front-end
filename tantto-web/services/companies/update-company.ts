import api from "../api";
import type {
  UpdateCompanyRequest,
  UpdateCompanyResponse,
} from "@/types/company";

export const updateCompany = async (
  companyId: string,
  payload: UpdateCompanyRequest
): Promise<UpdateCompanyResponse> => {
  try {
    const res = await api.patch<UpdateCompanyResponse>(
      `Company/update/${companyId}`,
      payload
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
