import api from "../api";
import type { Service } from "@/types/service";

export const getService = async (ServiceId: string): Promise<Service> => {
  try {
    const res = await api.get<Service>(`Service/${ServiceId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
