import axios, { type AxiosError } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const HEADERS = {
  "Content-Type": "application/json",
};

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    ...HEADERS,
  },
  withCredentials: true,
});

export type ErrorResponseType = {
  message: string;
};

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ErrorResponseType>) => {
    const status = error?.response?.status;
    const errorMessage = error?.response?.data?.message?.toLowerCase() || "";

    if (status === 401 && errorMessage.includes("invalid token")) {
      window.location.href = "/signin";
    }

    return Promise.reject(error);
  },
);

export { apiClient, apiUrl };
