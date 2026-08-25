import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { ApplicationDetailsResponse } from "@/module/applicant-details/types";

export function useApplicationDetails(applicationId: string, enabled = true) {
  return useQuery({
    queryKey: ["applications", applicationId],
    queryFn: async () => {
      const response = await apiClient.get<ApplicationDetailsResponse>(`/applications/${applicationId}`);

      return response.data.data;
    },
    enabled,
  });
}
