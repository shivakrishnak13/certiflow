import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type {
  ApplicationsResponse,
  DashboardApplication,
} from "@/module/dashboard/types";

export function useApplications(enabled = true) {
  return useQuery({
    queryKey: ["applications"],
    queryFn: async (): Promise<DashboardApplication[]> => {
      const response =
        await apiClient.get<ApplicationsResponse>("/applications");

      return response.data.data;
    },
    enabled,
  });
}
