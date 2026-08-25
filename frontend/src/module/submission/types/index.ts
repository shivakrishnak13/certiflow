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
