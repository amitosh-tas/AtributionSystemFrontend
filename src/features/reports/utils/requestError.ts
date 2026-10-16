import axios from "axios";

interface ApiErrorResponse {
  message?: unknown;
  error?: unknown;
}

export function getRequestErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const responseMessage = error.response?.data?.message;
    const responseError = error.response?.data?.error;

    if (typeof responseMessage === "string") return responseMessage;
    if (typeof responseError === "string") return responseError;
    if (error.message) return error.message;
  }

  return error instanceof Error ? error.message : "An unexpected error occurred.";
}
