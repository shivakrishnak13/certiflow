import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { CertificateDownloadResponse } from "@/module/submission/types";

export function useDownloadCertificate(applicationId: string) {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.get<CertificateDownloadResponse>(
        `/applications/${applicationId}/certificate/download`,
      );

      return response.data.data;
    },
  });
}