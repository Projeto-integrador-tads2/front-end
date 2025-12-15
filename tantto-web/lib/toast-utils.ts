import { toast } from "sonner";
import type { AxiosError } from "axios";

const TOAST_DURATION = {
  success: 3000,
  info: 3000,
  warning: 5000,
  error: 5000,
} as const;

interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

/**
 * Extracts the error message from an API response.
 * Maps HTTP status codes to user-friendly messages in PT-BR.
 *
 * @param error - Axios error or generic error
 * @param fallbackMessage - Default message when extraction is not possible
 * @returns User-friendly error message
 */
export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "Ocorreu um erro. Tente novamente."
): string {
  if (!error) return fallbackMessage;

  const axiosError = error as AxiosError<ApiErrorResponse>;

  const apiMessage =
    axiosError?.response?.data?.message || axiosError?.response?.data?.error;

  if (apiMessage) return apiMessage;

  const status = axiosError?.response?.status;

  switch (status) {
    case 400:
      return "Dados inválidos. Verifique os campos informados.";
    case 401:
      return "Sessão expirada. Faça login novamente.";
    case 403:
      return "Você não tem permissão para realizar esta ação.";
    case 404:
      return "Recurso não encontrado.";
    case 409:
      return "Conflito ao processar a solicitação.";
    case 422:
      return "Dados inválidos. Verifique os campos informados.";
    case 500:
    case 502:
    case 503:
    case 504:
      return "Erro no servidor. Tente novamente mais tarde.";
    default:
      if (error instanceof Error) {
        return error.message || fallbackMessage;
      }
      return fallbackMessage;
  }
}

/**
 * Extracts the success message from an API response.
 *
 * @param data - API response data
 * @param fallbackMessage - Default message when no message exists in the response
 * @returns Success message
 */
export function getApiSuccessMessage(
  data: unknown,
  fallbackMessage: string
): string {
  if (data && typeof data === "object" && "message" in data) {
    return (data as { message: string }).message || fallbackMessage;
  }
  return fallbackMessage;
}

/**
 * Success toast with default settings.
 *
 * @param message - Message to display
 * @param id - Optional ID for deduplication
 */
export function toastSuccess(message: string, id?: string) {
  toast.success(message, {
    id,
    duration: TOAST_DURATION.success,
  });
}

/**
 * Error toast with default settings.
 *
 * @param message - Message to display
 * @param id - Optional ID for deduplication
 */
export function toastError(message: string, id?: string) {
  toast.error(message, {
    id,
    duration: TOAST_DURATION.error,
  });
}

/**
 * Warning toast with default settings.
 *
 * @param message - Message to display
 * @param id - Optional ID for deduplication
 */
export function toastWarning(message: string, id?: string) {
  toast.warning(message, {
    id,
    duration: TOAST_DURATION.warning,
  });
}

/**
 * Info toast with default settings.
 *
 * @param message - Message to display
 * @param id - Optional ID for deduplication
 */
export function toastInfo(message: string, id?: string) {
  toast.info(message, {
    id,
    duration: TOAST_DURATION.info,
  });
}

/**
 * Default handler for mutation success.
 * Uses the API message if available, otherwise uses the fallback.
 *
 * @param data - API response data
 * @param fallbackMessage - Default message
 * @param toastId - Optional ID for deduplication
 */
export function handleMutationSuccess(
  data: unknown,
  fallbackMessage: string,
  toastId?: string
) {
  const message = getApiSuccessMessage(data, fallbackMessage);
  toastSuccess(message, toastId);
}

/**
 * Default handler for mutation errors.
 * Extracts the API message or uses HTTP status mapping.
 *
 * @param error - Error that occurred
 * @param fallbackMessage - Default message
 * @param toastId - Optional ID for deduplication
 */
export function handleMutationError(
  error: unknown,
  fallbackMessage: string,
  toastId?: string
) {
  const message = getApiErrorMessage(error, fallbackMessage);
  toastError(message, toastId);
}
