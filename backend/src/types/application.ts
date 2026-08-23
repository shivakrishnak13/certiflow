export interface CertificateData {
  referenceNumber: string;
  fullName: string;
  dateOfBirth: Date;
  registrationNumber: string;
  degree: string;
  specialization: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
}