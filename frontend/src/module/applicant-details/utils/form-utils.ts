import z from "zod";

const requiredText = z.string().trim().min(1, "This field is required.");

export const applicantDetailsSchema = z.object({
  fullName: requiredText,
  dateOfBirth: requiredText,
  registrationNumber: requiredText,
  degree: requiredText,
  specialization: requiredText,
  address: z.object({
    line1: requiredText,
    line2: z.string(),
    city: requiredText,
    state: requiredText,
    postalCode: requiredText,
  }),
});

export type ApplicantDetailsFormValues = z.infer<typeof applicantDetailsSchema>;
