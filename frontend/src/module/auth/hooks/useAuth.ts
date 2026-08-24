import { apiClient } from "@/lib/api";
import type { AuthResponseType, UserLoginDataType, UserRegisterDataType } from "@/module/auth/types";
import { useMutation } from "@tanstack/react-query";

const API_AUTH_URL = "/auth";

export const useAuth = () => {
  const useRegisterMutation = useMutation({
    mutationFn: async (userData: UserRegisterDataType) => {
      const response = await apiClient.post<AuthResponseType>(
        `${API_AUTH_URL}/register`,
        userData,
      );

      return response.data.data;
    },
  });

  const useLoginMutation = useMutation({
    mutationFn: async (userData: UserLoginDataType) => {
      const response = await apiClient.post<AuthResponseType>(
        `${API_AUTH_URL}/login`,
        userData,
      );

      return response.data.data;
    },
  });

  return { useRegisterMutation, useLoginMutation };
};
