"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { ErrorState } from "@/components/common/error-state";
import { LoadingPanel } from "@/components/common/loading-panel";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/config/routes";
import { useApplicationDetails } from "@/module/applicant-details/hooks/useApplicationDetails";
import { ReviewDocument } from "@/module/review/components/review-document";
import { getApiError } from "@/module/review/utils";
import { useSubmitApplication } from "@/module/submission/hooks/useSubmitApplication";

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
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium break-words">
        {value || <span className="font-normal text-muted-foreground">Not provided</span>}
      </dd>
    </div>
  );
}

export function ReviewStep({ applicationId }: ReviewStepProps) {
  const router = useRouter();
  const hasMounted = useSyncExternalStore(subscribe, () => true, () => false);
  const applicationQuery = useApplicationDetails(applicationId, hasMounted);
  const submitApplication = useSubmitApplication(applicationId);

  if (!hasMounted || applicationQuery.isLoading) {
    return <LoadingPanel label="Loading application review..." rows={4} />;
  }

  if (applicationQuery.isError) {
    return (
      <ErrorState
        title="Unable to load application review"
        description={getApiError(applicationQuery.error) || "Please try again."}
        action={
          <Button
            variant="outline"
            size="xl"
            onClick={() => router.push(routes.applications.documents(applicationId))}
          >
            Back to documents
          </Button>
        }
      />
    );
  }

  const applicant = applicationQuery.data?.application.applicant;
  const documents = applicationQuery.data?.documents || [];
  const idProof = documents.find((document) => document.type === "ID_PROOF");
  const degreeCertificate = documents.find((document) => document.type === "DEGREE_CERTIFICATE");
  const canSubmit = applicationQuery.data?.application.status === "DRAFT";
  const submitError = getApiError(submitApplication.error);
  const isSubmitting = submitApplication.isPending;

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
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Applicant Information</CardTitle>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <ReviewItem label="Full Name" value={applicant?.fullName} />
            <ReviewItem label="Date of Birth" value={applicant?.dateOfBirth?.slice(0, 10)} />
            <ReviewItem label="Registration Number" value={applicant?.registrationNumber} />
            <ReviewItem label="Degree" value={applicant?.degree} />
            <ReviewItem label="Specialization" value={applicant?.specialization} />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Address</CardTitle>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <ReviewItem label="Address Line 1" value={applicant?.address?.line1} />
            </div>
            {applicant?.address?.line2 ? (
              <div className="sm:col-span-2">
                <ReviewItem label="Address Line 2" value={applicant.address.line2} />
              </div>
            ) : null}
            <ReviewItem label="City" value={applicant?.address?.city} />
            <ReviewItem label="State" value={applicant?.address?.state} />
            <ReviewItem label="Postal Code" value={applicant?.address?.postalCode} />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Documents</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <ReviewDocument applicationId={applicationId} label="ID Proof" document={idProof} />
          <ReviewDocument applicationId={applicationId} label="Degree Certificate" document={degreeCertificate} />
        </CardContent>
      </Card>

      {submitApplication.isError && (
        <Alert>{submitError || "Unable to submit the application. Please try again."}</Alert>
      )}

      {!canSubmit && (
        <Alert variant="info">This application has already been submitted.</Alert>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="xl"
          className="w-full sm:w-auto"
          onClick={() => router.push(routes.applications.documents(applicationId))}
          disabled={isSubmitting}
        >
          Back
        </Button>

        <Button
          type="button"
          size="xl"
          className="w-full sm:w-auto sm:min-w-52"
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? (
            <LoaderCircle aria-hidden="true" className="animate-spin" />
          ) : null}
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </div>
  );
}
