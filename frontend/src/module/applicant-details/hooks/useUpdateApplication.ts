import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { ApplicantDetailsFormValues } from "@/module/applicant-details/utils/form-utils";

export function useUpdateApplication(applicationId: string) {
  return useMutation({
    mutationFn: async (applicant: ApplicantDetailsFormValues) => {
      await apiClient.patch(`/applications/${applicationId}`, { applicant });
    },
  });
}
