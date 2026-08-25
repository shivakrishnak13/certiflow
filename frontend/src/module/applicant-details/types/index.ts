export type ApplicantDetails = {
  fullName?: string;
  dateOfBirth?: string;
  registrationNumber?: string;
  degree?: string;
  specialization?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
};

export type ApplicationDetailsResponse = {
  message: string;
  data: {
    application: {
      _id: string;
      status: "DRAFT" | "SUBMITTED" | "COMPLETED";
      currentStep: number;
      applicant?: ApplicantDetails;
    };
  };
};
