import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { HTTP_STATUS } from "@/Constants";
import { showNotification } from "@/Attribute";
import { getToken } from "@/Utils";
import { getBaseUrl } from "./helper";

export async function Delete<T, TInput>(url: string, data?: TInput): Promise<T> {
  const authToken = getToken();
  const BASE_URL = getBaseUrl();

  const config: AxiosRequestConfig = {
    method: "DELETE",
    url: BASE_URL + url,
    headers: {
      Authorization: authToken,
    },
    data,
  };

  try {
    const response = await axios(config);
    const resData = response.data;

    if (response.status === HTTP_STATUS.OK) {
      showNotification("success", resData.message);
      return resData;
    } else {
      return null as T;
    }
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    const responseData = axiosError.response?.data as { message?: string };
    const message = responseData?.message || axiosError.message || "Something went wrong";
    throw new Error(message);
  }
}
