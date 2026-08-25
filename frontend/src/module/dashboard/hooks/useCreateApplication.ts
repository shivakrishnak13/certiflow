import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { CreateApplicationResponse } from "@/module/dashboard/types";

export function useCreateApplication() {
  const queryClient = useQueryClient();

  const useCreateApplicationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<CreateApplicationResponse>("/applications");

      return response.data.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });

  return { useCreateApplicationMutation };
}
