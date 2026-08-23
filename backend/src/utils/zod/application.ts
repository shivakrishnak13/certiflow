import { DOCUMENT_TYPE } from "@/types/enums/enums";
import z from "zod";

const updateApplicationSchema = z.object({
  applicant: z.object({
    fullName: z
      .string({ message: "Full name is required" })
      .min(2, "Full name must be at least 2 characters"),
    dateOfBirth: z.coerce
      .date({
        message: "Date of birth is required",
      })
      .max(new Date(), "Date of birth cannot be in the future"),
    registrationNumber: z
      .string({ message: "Registration number is required" })
      .min(1, "Registration number is required"),
    address: z.object({
      line1: z
        .string({ message: "Address line 1 is required" })
        .min(1, "Address line 1 is required"),
      line2: z.string().optional(),
      city: z
        .string({ message: "City is required" })
        .min(1, "City is required"),
      state: z
        .string({ message: "State is required" })
        .min(1, "State is required"),
      postalCode: z
        .string({ message: "Postal code is required" })
        .min(4, "Postal code must be at least 4 characters"),
    }),
  }),
});

type UpdateApplication = z.infer<typeof updateApplicationSchema>;

const documentUploadSchema = z.object({
  documentType: z.enum(DOCUMENT_TYPE, {
    message: "Document type must be ID_PROOF or DEGREE_CERTIFICATE",
  }),
});


export {
  updateApplicationSchema,
  UpdateApplication,
  documentUploadSchema,
};
