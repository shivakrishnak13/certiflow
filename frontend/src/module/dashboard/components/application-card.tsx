"use client";

import { isAxiosError } from "axios";
import { CircleCheck, Download, FileClock, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
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
import type { ApplicationCurrentStep, DashboardApplication } from "@/module/dashboard/types";

type ApplicationCardProps = {
  application: DashboardApplication;
};

const statusLabel: Record<DashboardApplication["status"], string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  COMPLETED: "Completed",
};

const stepLabel: Record<ApplicationCurrentStep, string> = {
  1: "Applicant Details",
  2: "Documents",
  3: "Review",
};

const draftStepRoutes: Record<ApplicationCurrentStep, (id: string) => string> = {
  1: routes.applications.details,
  2: routes.applications.documents,
  3: routes.applications.review,
};

export function ApplicationCard({
  application,
}: ApplicationCardProps) {
  const router = useRouter();

  const isDraft = application.status === "DRAFT";
  const isSubmitted = application.status === "SUBMITTED";

  const downloadCertificate = useDownloadCertificate(application._id);

  const handleOpenApplication = () => {
    const applicationRoute = isDraft
      ? draftStepRoutes[application.currentStep](application._id)
      : routes.applications.details(application._id);

    router.push(applicationRoute);
  };

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
    <Card className="flex h-full flex-col">
      <CardHeader className="gap-2">
        <Badge
          variant={isDraft ? "outline" : "success"}
          className="w-fit gap-1.5"
        >
          {isDraft ? (
            <FileClock aria-hidden="true" />
          ) : (
            <CircleCheck aria-hidden="true" />
          )}
          {statusLabel[application.status]}
        </Badge>

        <CardTitle className="line-clamp-2 break-words">
          {application.applicant?.fullName || "Untitled application"}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        {isDraft ? (
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Next step</p>
            <p className="text-sm font-medium">
              Step {application.currentStep} of 3 &middot;{" "}
              {stepLabel[application.currentStep]}
            </p>
          </div>
        ) : application.referenceNumber ? (
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Reference number</p>
            <p className="font-mono text-sm font-medium break-all">
              {application.referenceNumber}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Reference number not available.
          </p>
        )}

        {isSubmitted && downloadCertificate.isError ? (
          <Alert className="mt-3">
            {downloadError || "Unable to download certificate. Please try again."}
          </Alert>
        ) : null}
      </CardContent>

      {(isDraft || isSubmitted) && (
        <CardFooter className="flex-col items-stretch gap-2">
          <Button
            className="w-full"
            size="xl"
            variant={isDraft ? "default" : "outline"}
            onClick={handleOpenApplication}
          >
            {isDraft ? "Continue Application" : "View Application"}
          </Button>

          {isSubmitted && (
            <Button
              className="w-full"
              size="xl"
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
          )}
        </CardFooter>
      )}
    </Card>
  );
}
