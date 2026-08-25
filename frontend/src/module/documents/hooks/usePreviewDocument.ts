import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { PreviewDocumentResponse } from "@/module/documents/types";

export function usePreviewDocument(applicationId: string) {
  return useMutation({
    mutationFn: async (documentId: string) => {
      const response = await apiClient.get<PreviewDocumentResponse>(
        `/applications/${applicationId}/documents/${documentId}/view`,
      );

      return response.data.data;
    },
  });
}
