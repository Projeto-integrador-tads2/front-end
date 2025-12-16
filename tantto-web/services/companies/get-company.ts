import api from "../api";
import type { Company } from "@/types/company";

export const getCompany = async (companyId: string): Promise<Company> => {
  try {
    const res = await api.get<Company>(`Company/${companyId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
