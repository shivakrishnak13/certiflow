import { apiClient } from "@/lib/api";
import type {
  AuthResponseType,
  AuthUserType,
  LogoutResponse,
  MeResponse,
  UserLoginDataType,
  UserRegisterDataType,
} from "@/module/auth/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_AUTH_URL = "/auth";

export const authKeys = {
  me: ["auth", "me"] as const,
};

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

  const useMeQuery = useQuery({
    queryKey: authKeys.me,
    queryFn: async (): Promise<AuthUserType> => {
      const response = await apiClient.get<MeResponse>(`${API_AUTH_URL}/me`);

      return response.data.data.user;
    },
    retry: false,
  });

  const useLogoutMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async () => {
        const response = await apiClient.post<LogoutResponse>(`${API_AUTH_URL}/logout`);

        return response.data;
      },

      onSuccess: async () => {
        await queryClient.cancelQueries();

        queryClient.removeQueries({
          queryKey: authKeys.me,
        });

        queryClient.clear();
      },
    });
  };

  return { useRegisterMutation, useLoginMutation, useMeQuery, useLogoutMutation };
};
