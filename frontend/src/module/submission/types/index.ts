export type SubmissionResponse = {
  message: string;
  data: {
    applicationId: string;
    status: "SUBMITTED";
    referenceNumber: string;
    submittedAt: string;
  };
};

export type SubmissionDetails = SubmissionResponse["data"];

export type CertificateDownloadResponse = {
  message: string;
  data: {
    url: string;
    fileName: string;
  };
};