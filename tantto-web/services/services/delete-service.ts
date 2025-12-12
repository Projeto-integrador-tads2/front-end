import api from "../api";
import type { DeleteServiceResponse } from "@/types/service";

export const deleteService = async (
  serviceId: string
): Promise<DeleteServiceResponse> => {
  try {
    const res = await api.delete<DeleteServiceResponse>(
      `Service/delete/${serviceId}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
