import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { ApplicationDocumentType } from "@/module/applicant-details/types";

type UploadDocumentInput = {
  documentType: ApplicationDocumentType;
  file: File;
};

export function useUploadDocument(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentType, file }: UploadDocumentInput) => {
      const formData = new FormData();
      formData.append("documentType", documentType);
      formData.append("file", file);

      await apiClient.post(`/applications/${applicationId}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["applications", applicationId] });
    },
  });
}
