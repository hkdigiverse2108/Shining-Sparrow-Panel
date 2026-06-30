import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { getToken } from "@/Utils";
import { HTTP_STATUS } from "@/Constants";
import { showNotification } from "@/Attribute";
import { getBaseUrl } from "./helper";

export async function Post<TInput, TResponse>(
  url: string,
  data?: TInput,
  isToken: boolean = true,
  showSuccessToast: boolean = true
): Promise<TResponse> {
  // console.log("requsting URl: ", url);
  const authToken = getToken();
  const isFormData = data instanceof FormData;
  const BASE_URL = getBaseUrl();

  const config: AxiosRequestConfig = {
    method: "POST",
    url: BASE_URL + url,
    headers: {
      ...(isToken ? { Authorization: authToken } : {}),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
    data,
  };

  try {
    const response = await axios(config);
    const resData = response.data;

    if (response.status === HTTP_STATUS.CREATED || response.status === HTTP_STATUS.OK) {
      if (showSuccessToast && resData.message) {
        showNotification("success", resData.message);
      }
      return resData;
    } else {
      return null as TResponse;
    }
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    const responseData = axiosError.response?.data as { message?: string };
    const message = responseData?.message || axiosError.message || "Something went wrong";

    throw new Error(message);
  }
}
