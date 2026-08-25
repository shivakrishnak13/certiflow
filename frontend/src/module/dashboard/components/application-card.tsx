"use client";

import { isAxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { routes } from "@/config/routes";
import { useDownloadCertificate } from "@/module/submission/hooks/useDownloadCertificate";
import type { DashboardApplication } from "@/module/dashboard/types";

type ApplicationCardProps = {
  application: DashboardApplication;
};

const statusLabel: Record<DashboardApplication["status"], string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  COMPLETED: "Completed",
};

export function ApplicationCard({
  application,
}: ApplicationCardProps) {
  const router = useRouter();

  const isDraft = application.status === "DRAFT";
  const isSubmitted = application.status === "SUBMITTED";

  const downloadCertificate = useDownloadCertificate(application._id);

  const handleDownloadCertificate = () => {
    downloadCertificate.mutate(undefined, {
      onSuccess: ({ url, fileName }) => {
        const link = document.createElement("a");

        link.href = url;
        link.download = fileName;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        document.body.appendChild(link);
        link.click();
        link.remove();
      },
    });
  };

  const downloadError = isAxiosError(downloadCertificate.error)
    ? downloadCertificate.error.response?.data?.message
    : null;

  return (
    <Card>
      <CardHeader className="gap-2 sm:flex sm:flex-row sm:items-start sm:justify-between">
        <CardTitle>
          {application.applicant.fullName || "Untitled application"}
        </CardTitle>

        <Badge variant={isDraft ? "secondary" : "outline"}>
          {statusLabel[application.status]}
        </Badge>
      </CardHeader>

      {application.referenceNumber ? (
        <CardContent className="text-muted-foreground">
          Reference number: {application.referenceNumber}
        </CardContent>
      ) : null}

      {isSubmitted && downloadError ? (
        <CardContent className="pt-0">
          <p className="text-sm text-destructive">
            {downloadError || "Unable to download certificate. Please try again."}
          </p>
        </CardContent>
      ) : null}

      {(isDraft || isSubmitted) && (
        <CardFooter className="flex-col items-stretch gap-2 sm:flex-row sm:justify-end">
          <Button
            className="w-full sm:w-auto"
            onClick={() =>
              router.push(routes.applications.details(application._id))
            }
          >
            {isDraft ? "Continue Application" : "View Application"}
          </Button>

          {isSubmitted && (
            <Button
              className="w-full sm:w-auto"
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
          )}
        </CardFooter>
      )}
    </Card>
  );
}