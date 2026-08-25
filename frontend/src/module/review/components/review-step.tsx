"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/config/routes";
import { useApplicationDetails } from "@/module/applicant-details/hooks/useApplicationDetails";
import { formatAddress, getApiError } from "@/module/review/utils";
import { useSubmitApplication } from "@/module/submission/hooks/useSubmitApplication";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { ReviewDocument } from "@/module/review/components/review-document";

type ReviewStepProps = {
  applicationId: string;
};

type ReviewItemProps = {
  label: string;
  value?: string;
};

const subscribe = () => () => undefined;

function ReviewItem({ label, value }: ReviewItemProps) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{value || "Not provided"}</dd>
    </div>
  );
}

export function ReviewStep({ applicationId }: ReviewStepProps) {
  const router = useRouter();
  const hasMounted = useSyncExternalStore(subscribe, () => true, () => false);
  const applicationQuery = useApplicationDetails(applicationId, hasMounted);
  const submitApplication = useSubmitApplication(applicationId);

  if (!hasMounted || applicationQuery.isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground" role="status">
        <LoaderCircle className="size-4 animate-spin" />
        Loading application review...
      </div>
    );
  }

  if (applicationQuery.isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="font-medium">Unable to load application review</p>
        <p className="mt-1 text-sm text-muted-foreground">{getApiError(applicationQuery.error) || "Please try again."}</p>
        <Button className="mt-4" variant="outline" onClick={() => router.push(routes.applications.documents(applicationId))}>
          Back to documents
        </Button>
      </div>
    );
  }

  const applicant = applicationQuery.data?.application.applicant;
  const documents = applicationQuery.data?.documents || [];
  const idProof = documents.find((document) => document.type === "ID_PROOF");
  const degreeCertificate = documents.find((document) => document.type === "DEGREE_CERTIFICATE");
  const canSubmit = applicationQuery.data?.application.status === "DRAFT";
  const submitError = getApiError(submitApplication.error);

  const handleSubmit = () => {
    submitApplication.mutate(undefined, {
      onSuccess: (submission) => {
        const searchParams = new URLSearchParams({
          referenceNumber: submission.referenceNumber,
          status: submission.status,
          submittedAt: submission.submittedAt,
        });

        router.push(`${routes.applications.success(submission.applicationId)}?${searchParams.toString()}`);
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Review application</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <ReviewItem label="Full Name" value={applicant?.fullName} />
            <ReviewItem label="Date of Birth" value={applicant?.dateOfBirth?.slice(0, 10)} />
            <ReviewItem label="Registration Number" value={applicant?.registrationNumber} />
            <ReviewItem label="Degree" value={applicant?.degree} />
            <ReviewItem label="Specialization" value={applicant?.specialization} />
            <div className="sm:col-span-2">
              <ReviewItem label="Address" value={formatAddress(applicant?.address)} />
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Required documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ReviewDocument applicationId={applicationId} label="ID Proof" document={idProof} />
          <ReviewDocument applicationId={applicationId} label="Degree Certificate" document={degreeCertificate} />
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={() => router.push(routes.applications.documents(applicationId))}>
          Back
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={!canSubmit || submitApplication.isPending}>
          {submitApplication.isPending ? <LoaderCircle className="animate-spin" /> : null}
          Submit Application
        </Button>
      </div>
      {submitApplication.isError && (
        <p className="text-right text-sm text-destructive">{submitError || "Unable to submit the application. Please try again."}</p>
      )}
    </div>
  );
}
