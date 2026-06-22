import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { HTTP_STATUS, ROUTES } from "@/Constants";
import type { Params } from "@/Types";
import { getToken, Storage } from "@/Utils";
import { showNotification } from "@/Attribute";

let isRedirecting = false;

export async function Get<T>(url: string, params?: Params, headers?: Record<string, string>): Promise<T> {
  const authToken = getToken();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const config: AxiosRequestConfig = {
    method: "GET",
    headers: {
      Authorization: authToken,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      ...headers,
    },
    params,
  };

  try {
    const response = await axios.get<T>(BASE_URL + url, config);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;

    if (axiosError?.response?.status === HTTP_STATUS.UNAUTHORIZED && !isRedirecting) {
      Storage.clear();
      isRedirecting = true;
      window.location.href = ROUTES.HOME;
      setTimeout(() => (isRedirecting = false), 1000);
    } else {
      const message = axiosError?.response?.data?.message || axiosError.message || "An error occurred";
      showNotification("error", message);
    }
    throw null;
  }
}
