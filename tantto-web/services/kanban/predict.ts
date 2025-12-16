import api from "../api";

/**
 * Prediction result types
 */
export type PredictionResult = "Muito Provável" | "Provável" | "Pouco Provável";

/**
 * Request payload for prediction endpoint
 */
export interface PredictRequest {
  companyCardId: string;
}

/**
 * Response from prediction endpoint
 */
export interface PredictResponse {
  result: PredictionResult;
  companyCardId: string;
}

/**
 * Call prediction API for a company card
 *
 * @param companyCardId - UUID of the company card
 * @returns Prediction result
 */
export const predictCompanyCard = async (
  companyCardId: string
): Promise<PredictResponse> => {
  try {
    const response = await api.post<PredictResponse>("/Predict", {
      companyCardId,
    });
    return response.data;
  } catch (error) {
    console.error("Error predicting company card:", error);
    throw error;
  }
};
