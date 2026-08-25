"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/config/routes";
import type { ErrorResponseType } from "@/lib/api";
import { useApplicationDetails } from "@/module/applicant-details/hooks/useApplicationDetails";
import { useUpdateApplication } from "@/module/applicant-details/hooks/useUpdateApplication";
import type { ApplicantDetails } from "@/module/applicant-details/types";
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

function FieldError({ children }: { children?: string }) {
  return children ? <p className="text-xs text-destructive">{children}</p> : null;
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

  if (!hasMounted || applicationQuery.isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground" role="status">
        <LoaderCircle className="size-4 animate-spin" />
        Loading application details...
      </div>
    );
  }

  if (applicationQuery.isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="font-medium">Unable to load application details</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {loadError || "Please return to the dashboard and try again."}
        </p>
        <Button className="mt-4" variant="outline" onClick={() => router.push(routes.dashboard)}>Back to dashboard</Button>
      </div>
    );
  }

  const { errors } = form.formState;

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Applicant details</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" {...form.register("fullName")} aria-invalid={!!errors.fullName} />
              <FieldError>{errors.fullName?.message}</FieldError>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of birth</Label>
              <Input id="dateOfBirth" type="date" {...form.register("dateOfBirth")} aria-invalid={!!errors.dateOfBirth} />
              <FieldError>{errors.dateOfBirth?.message}</FieldError>
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration number</Label>
              <Input id="registrationNumber" {...form.register("registrationNumber")} aria-invalid={!!errors.registrationNumber} />
              <FieldError>{errors.registrationNumber?.message}</FieldError>
            </div>
            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <Input id="degree" {...form.register("degree")} aria-invalid={!!errors.degree} />
              <FieldError>{errors.degree?.message}</FieldError>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input id="specialization" {...form.register("specialization")} aria-invalid={!!errors.specialization} />
              <FieldError>{errors.specialization?.message}</FieldError>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <p className="font-medium">Address</p>
            <div className="space-y-2">
              <Label htmlFor="line1">Address line 1</Label>
              <Input id="line1" {...form.register("address.line1")} aria-invalid={!!errors.address?.line1} />
              <FieldError>{errors.address?.line1?.message}</FieldError>
            </div>
            <div className="space-y-2">
              <Label htmlFor="line2">Address line 2</Label>
              <Input id="line2" {...form.register("address.line2")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...form.register("address.city")} aria-invalid={!!errors.address?.city} />
                <FieldError>{errors.address?.city?.message}</FieldError>
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" {...form.register("address.state")} aria-invalid={!!errors.address?.state} />
                <FieldError>{errors.address?.state?.message}</FieldError>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal code</Label>
                <Input id="postalCode" {...form.register("address.postalCode")} aria-invalid={!!errors.address?.postalCode} />
                <FieldError>{errors.address?.postalCode?.message}</FieldError>
              </div>
            </div>
          </div>

          {updateApplication.isError && (
            <p className="text-sm text-destructive">{apiError || "Unable to save applicant details. Please try again."}</p>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => router.push(routes.dashboard)} disabled={updateApplication.isPending}>
              Back
            </Button>
            <Button type="submit" disabled={updateApplication.isPending}>
              {updateApplication.isPending ? <LoaderCircle className="animate-spin" /> : null}
              Next
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
