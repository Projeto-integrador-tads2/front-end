import api from "../api";
import type {
  CreateServiceRequest,
  CreateServiceResponse,
} from "@/types/service";

export const createService = async (
  payload: CreateServiceRequest
): Promise<CreateServiceResponse> => {
  try {
    const res = await api.post<CreateServiceResponse>(
      "Service/register",
      payload
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
