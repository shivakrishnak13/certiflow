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
