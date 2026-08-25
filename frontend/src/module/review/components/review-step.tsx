"use client";

import { isAxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/config/routes";
import type { ErrorResponseType } from "@/lib/api";
import { useApplicationDetails } from "@/module/applicant-details/hooks/useApplicationDetails";
import type { ApplicationDocument, ApplicantDetails } from "@/module/applicant-details/types";
import { usePreviewDocument } from "@/module/documents/hooks/usePreviewDocument";

type ReviewStepProps = {
  applicationId: string;
};

type ReviewItemProps = {
  label: string;
  value?: string;
};

type ReviewDocumentProps = {
  applicationId: string;
  label: string;
  document?: ApplicationDocument;
};

const subscribe = () => () => undefined;

function getApiError(error: unknown) {
  return isAxiosError<ErrorResponseType>(error) ? error.response?.data.message : null;
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatAddress(address?: ApplicantDetails["address"]) {
  const parts = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postalCode,
  ].filter(Boolean);

  return parts.join(", ") || undefined;
}

function ReviewItem({ label, value }: ReviewItemProps) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{value || "Not provided"}</dd>
    </div>
  );
}

function ReviewDocument({ applicationId, label, document }: ReviewDocumentProps) {
  const previewDocument = usePreviewDocument(applicationId);
  const previewError = getApiError(previewDocument.error);

  const handlePreview = () => {
    if (!document) return;

    previewDocument.mutate(document.id, {
      onSuccess: ({ url }) => {
        window.open(url, "_blank", "noopener,noreferrer");
      },
    });
  };

  return (
    <div className="rounded-xl border p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">{label}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {document ? `${document.originalName} · ${formatFileSize(document.size)}` : "Not uploaded"}
          </p>
        </div>
        {document && (
          <Button type="button" variant="outline" onClick={handlePreview} disabled={previewDocument.isPending}>
            {previewDocument.isPending ? <LoaderCircle className="animate-spin" /> : null}
            Preview
          </Button>
        )}
      </div>
      {previewDocument.isError && (
        <p className="mt-3 text-sm text-destructive">{previewError || "Unable to preview the document. Please try again."}</p>
      )}
    </div>
  );
}

export function ReviewStep({ applicationId }: ReviewStepProps) {
  const router = useRouter();
  const hasMounted = useSyncExternalStore(subscribe, () => true, () => false);
  const applicationQuery = useApplicationDetails(applicationId, hasMounted);

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
        <Button type="button" disabled>Submit Application</Button>
      </div>
    </div>
  );
}
