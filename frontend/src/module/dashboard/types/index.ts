export type ApplicationStatus = "DRAFT" | "SUBMITTED" | "COMPLETED";

export type DashboardApplication = {
  _id: string;
  status: ApplicationStatus;
  applicant: {
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
