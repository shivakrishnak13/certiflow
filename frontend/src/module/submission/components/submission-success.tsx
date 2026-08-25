"use client";

import { isAxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Application submitted successfully</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <dl className="space-y-3">
          <div>
            <dt className="text-sm text-muted-foreground">
              Reference number
            </dt>
            <dd className="mt-1 font-medium">
              {submission.referenceNumber}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-muted-foreground">
              Submitted date/time
            </dt>
            <dd className="mt-1 font-medium">
              {formatSubmittedAt(submission.submittedAt)}
            </dd>
          </div>
        </dl>

        {downloadError ? (
          <p className="text-sm text-destructive">
            {downloadError || "Unable to download certificate. Please try again."}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadCertificate}
            disabled={downloadCertificate.isPending}
          >
            {downloadCertificate.isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : null}
            {downloadCertificate.isPending
              ? "Preparing..."
              : "Download Certificate"}
          </Button>

          <Button
            type="button"
            onClick={() => router.push(routes.dashboard)}
          >
            Go to Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
