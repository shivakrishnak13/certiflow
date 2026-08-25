export type ApplicationStatus = "DRAFT" | "SUBMITTED" | "COMPLETED";
export type ApplicationCurrentStep = 1 | 2 | 3;

export type DashboardApplication = {
  _id: string;
  status: ApplicationStatus;
  currentStep: ApplicationCurrentStep;
  applicant?: {
    fullName?: string;
  };
  referenceNumber?: string;
};

export type ApplicationsResponse = {
  success: true;
  message: string;
  data: DashboardApplication[];
};

export type CreateApplicationResponse = {
  message: string;
  data: {
    _id: string;
    status: "DRAFT";
    currentStep: 1;
  };
};
