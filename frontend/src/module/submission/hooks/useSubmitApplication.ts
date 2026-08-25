import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { SubmissionResponse } from "@/module/submission/types";

export function useSubmitApplication(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<SubmissionResponse>(`/applications/${applicationId}/submit`);

      return response.data.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}
