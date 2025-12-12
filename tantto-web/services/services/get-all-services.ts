import api from "../api";
import type { Service } from "@/types/service";

export const getAllServices = async (): Promise<Service[]> => {
  try {
    const res = await api.get<Service[]>("Service");
    return res.data;
  } catch (error) {
    throw error;
  }
};
