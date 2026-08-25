import type { ApplicationDocument } from "@/module/applicant-details/types";

export type PreviewDocumentResponse = {
  message: string;
  data: {
    document: ApplicationDocument;
    url: string;
  };
};
