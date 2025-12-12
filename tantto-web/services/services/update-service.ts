import api from "../api";
import type {
  UpdateServiceRequest,
  UpdateServiceResponse,
} from "@/types/service";

export const updateService = async (
  ServiceId: string,
  payload: UpdateServiceRequest
): Promise<UpdateServiceResponse> => {
  try {
    const res = await api.patch<UpdateServiceResponse>(
      `Service/update/${ServiceId}`,
      payload
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
