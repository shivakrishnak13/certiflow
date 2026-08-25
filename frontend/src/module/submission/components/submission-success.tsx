"use client";

import { isAxiosError } from "axios";
import { CircleCheck, Download, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { routes } from "@/config/routes";
import { useDownloadCertificate } from "@/module/submission/hooks/useDownloadCertificate";
import type { SubmissionDetails } from "@/module/submission/types";

type SubmissionSuccessProps = {
  submission: SubmissionDetails;
};

function formatSubmittedAt(submittedAt: string) {
  const date = new Date(submittedAt);

  return Number.isNaN(date.getTime())
    ? submittedAt
    : new Intl.DateTimeFormat("en-GB", {
        dateStyle: "short",
        timeStyle: "medium",
        hour12: false,
        timeZone: "UTC",
      }).format(date);
}

export function SubmissionSuccess({
  submission,
}: SubmissionSuccessProps) {
  const router = useRouter();

  const downloadCertificate = useDownloadCertificate(
    submission.applicationId,
  );

  const handleDownloadCertificate = async () => {
    downloadCertificate.mutate(undefined, {
      onSuccess: async ({ url, fileName }) => {
        try {
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error("Failed to download certificate.");
          }

          const blob = await response.blob();

          const blobUrl = window.URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = fileName;

          document.body.appendChild(link);
          link.click();
          link.remove();

          window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
          console.error("Certificate download failed:", error);
        }
      },
    });
  };

  const downloadError = isAxiosError(downloadCertificate.error)
    ? downloadCertificate.error.response?.data?.message
    : null;

  return (
    <Card className="mx-auto w-full max-w-xl [--card-spacing:--spacing(5)] sm:[--card-spacing:--spacing(6)]">
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
            <CircleCheck aria-hidden="true" className="size-6" />
          </span>

          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">
              Application Submitted Successfully
            </h1>
            <p className="text-sm text-pretty text-muted-foreground">
              Your application has been submitted successfully. Keep your
              reference number for future correspondence.
            </p>
          </div>
        </div>

        <dl className="divide-y rounded-lg border">
          <div className="px-4 py-3">
            <dt className="text-xs text-muted-foreground">Reference Number</dt>
            <dd className="mt-0.5 font-mono text-sm font-semibold break-all">
              {submission.referenceNumber}
            </dd>
          </div>

          <div className="px-4 py-3">
            <dt className="text-xs text-muted-foreground">Submitted On</dt>
            <dd className="mt-0.5 text-sm font-medium">
              {formatSubmittedAt(submission.submittedAt)}
            </dd>
          </div>
        </dl>

        {downloadCertificate.isError ? (
          <Alert>
            {downloadError || "Unable to download certificate. Please try again."}
          </Alert>
        ) : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="outline"
            size="xl"
            className="w-full sm:w-auto"
            onClick={() => router.push(routes.dashboard)}
          >
            Go to Dashboard
          </Button>

          <Button
            type="button"
            size="xl"
            className="w-full sm:w-auto"
            onClick={handleDownloadCertificate}
            disabled={downloadCertificate.isPending}
          >
            {downloadCertificate.isPending ? (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            ) : (
              <Download aria-hidden="true" />
            )}
            {downloadCertificate.isPending
              ? "Preparing..."
              : "Download Certificate"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
