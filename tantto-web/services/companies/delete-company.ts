import api from "../api";
import type { DeleteCompanyResponse } from "@/types/company";

export const deleteCompany = async (
  companyId: string
): Promise<DeleteCompanyResponse> => {
  try {
    const res = await api.delete<DeleteCompanyResponse>(
      `Company/delete/${companyId}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
