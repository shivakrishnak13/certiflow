"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ErrorState } from "@/components/common/error-state";
import { fieldAria, FormField } from "@/components/common/form-field";
import { LoadingPanel } from "@/components/common/loading-panel";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { routes } from "@/config/routes";
import type { ErrorResponseType } from "@/lib/api";
import { useApplicationDetails } from "@/module/applicant-details/hooks/useApplicationDetails";
import { useUpdateApplication } from "@/module/applicant-details/hooks/useUpdateApplication";
import type { ApplicantDetails } from "@/module/applicant-details/types";
import { DEGREE_OPTIONS } from "@/module/applicant-details/utils/degree-options";
import { applicantDetailsSchema, type ApplicantDetailsFormValues } from "@/module/applicant-details/utils/form-utils";

type ApplicantDetailsFormProps = {
  applicationId: string;
};

const subscribe = () => () => undefined;

const emptyApplicant: ApplicantDetailsFormValues = {
  fullName: "",
  dateOfBirth: "",
  registrationNumber: "",
  degree: "",
  specialization: "",
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
  },
};

function toFormValues(applicant?: ApplicantDetails): ApplicantDetailsFormValues {
  return {
    fullName: applicant?.fullName || "",
    dateOfBirth: applicant?.dateOfBirth?.slice(0, 10) || "",
    registrationNumber: applicant?.registrationNumber || "",
    degree: applicant?.degree || "",
    specialization: applicant?.specialization || "",
    address: {
      line1: applicant?.address?.line1 || "",
      line2: applicant?.address?.line2 || "",
      city: applicant?.address?.city || "",
      state: applicant?.address?.state || "",
      postalCode: applicant?.address?.postalCode || "",
    },
  };
}

export function ApplicantDetailsForm({ applicationId }: ApplicantDetailsFormProps) {
  const router = useRouter();
  const hasMounted = useSyncExternalStore(subscribe, () => true, () => false);
  const applicationQuery = useApplicationDetails(applicationId, hasMounted);
  const updateApplication = useUpdateApplication(applicationId);
  const form = useForm<ApplicantDetailsFormValues>({
    resolver: zodResolver(applicantDetailsSchema),
    defaultValues: emptyApplicant,
  });

  useEffect(() => {
    if (applicationQuery.data) {
      form.reset(toFormValues(applicationQuery.data.application.applicant));
    }
  }, [applicationQuery.data, form]);

  const apiError = isAxiosError<ErrorResponseType>(updateApplication.error)
    ? updateApplication.error.response?.data.message
    : null;
  const loadError = isAxiosError<ErrorResponseType>(applicationQuery.error)
    ? applicationQuery.error.response?.data.message
    : null;

  const onSubmit = (values: ApplicantDetailsFormValues) => {
    updateApplication.mutate(values, {
      onSuccess: () => router.push(routes.applications.documents(applicationId)),
    });
  };

  const selectedDegree = useWatch({ control: form.control, name: "degree" });
  const degreeOptions =
    selectedDegree && !DEGREE_OPTIONS.includes(selectedDegree)
      ? [selectedDegree, ...DEGREE_OPTIONS]
      : DEGREE_OPTIONS;

  if (!hasMounted || applicationQuery.isLoading) {
    return <LoadingPanel label="Loading application details..." rows={5} />;
  }

  if (applicationQuery.isError) {
    return (
      <ErrorState
        title="Unable to load application details"
        description={loadError || "Please return to the dashboard and try again."}
        action={
          <Button variant="outline" size="xl" onClick={() => router.push(routes.dashboard)}>
            Back to dashboard
          </Button>
        }
      />
    );
  }

  const { errors } = form.formState;
  const isSaving = updateApplication.isPending;

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="fullName"
            label="Full name"
            required
            error={errors.fullName?.message}
            className="sm:col-span-2"
          >
            <Input
              id="fullName"
              autoComplete="name"
              placeholder="Jane Doe"
              {...form.register("fullName")}
              {...fieldAria("fullName", errors.fullName?.message)}
            />
          </FormField>

          <FormField id="dateOfBirth" label="Date of birth" required error={errors.dateOfBirth?.message}>
            <Input
              id="dateOfBirth"
              type="date"
              {...form.register("dateOfBirth")}
              {...fieldAria("dateOfBirth", errors.dateOfBirth?.message)}
            />
          </FormField>

          <FormField id="registrationNumber" label="Registration number" required error={errors.registrationNumber?.message}>
            <Input
              id="registrationNumber"
              placeholder="REG123456"
              {...form.register("registrationNumber")}
              {...fieldAria("registrationNumber", errors.registrationNumber?.message)}
            />
          </FormField>

          <FormField id="degree" label="Degree" required error={errors.degree?.message}>
            <Select
              id="degree"
              {...form.register("degree")}
              {...fieldAria("degree", errors.degree?.message)}
            >
              <option value="">Select a degree</option>
              {degreeOptions.map((degree) => (
                <option key={degree} value={degree}>
                  {degree}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField id="specialization" label="Specialization" required error={errors.specialization?.message}>
            <Input
              id="specialization"
              placeholder="Computer Science"
              {...form.register("specialization")}
              {...fieldAria("specialization", errors.specialization?.message)}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Address Information</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-6">
          <FormField
            id="line1"
            label="Address line 1"
            required
            error={errors.address?.line1?.message}
            className="sm:col-span-6"
          >
            <Input
              id="line1"
              autoComplete="address-line1"
              {...form.register("address.line1")}
              {...fieldAria("line1", errors.address?.line1?.message)}
            />
          </FormField>

          <FormField id="line2" label="Address line 2" className="sm:col-span-6">
            <Input id="line2" autoComplete="address-line2" {...form.register("address.line2")} />
          </FormField>

          <FormField
            id="city"
            label="City"
            required
            error={errors.address?.city?.message}
            className="sm:col-span-3 md:col-span-2"
          >
            <Input
              id="city"
              autoComplete="address-level2"
              {...form.register("address.city")}
              {...fieldAria("city", errors.address?.city?.message)}
            />
          </FormField>

          <FormField
            id="state"
            label="State"
            required
            error={errors.address?.state?.message}
            className="sm:col-span-3 md:col-span-2"
          >
            <Input
              id="state"
              autoComplete="address-level1"
              {...form.register("address.state")}
              {...fieldAria("state", errors.address?.state?.message)}
            />
          </FormField>

          <FormField
            id="postalCode"
            label="Postal code"
            required
            error={errors.address?.postalCode?.message}
            className="sm:col-span-6 md:col-span-2"
          >
            <Input
              id="postalCode"
              inputMode="numeric"
              autoComplete="postal-code"
              {...form.register("address.postalCode")}
              {...fieldAria("postalCode", errors.address?.postalCode?.message)}
            />
          </FormField>
        </CardContent>
      </Card>

      {updateApplication.isError && (
        <Alert>{apiError || "Unable to save applicant details. Please try again."}</Alert>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="xl"
          className="w-full sm:w-auto"
          onClick={() => router.push(routes.dashboard)}
          disabled={isSaving}
        >
          Back
        </Button>

        <Button type="submit" size="xl" className="w-full sm:w-auto" disabled={isSaving}>
          {isSaving ? (
            <LoaderCircle aria-hidden="true" className="animate-spin" />
          ) : null}
          {isSaving ? "Saving..." : "Save and Continue"}
          {isSaving ? null : <ArrowRight aria-hidden="true" data-icon="inline-end" />}
        </Button>
      </div>
    </form>
  );
}
