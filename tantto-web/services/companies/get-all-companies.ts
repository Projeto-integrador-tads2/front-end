import api from "../api";
import type { Company } from "@/types/company";

export const getAllCompanies = async (): Promise<Company[]> => {
  try {
    const res = await api.get<Company[]>("Company");
    return res.data;
  } catch (error) {
    throw error;
  }
};
