"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardApplication } from "@/module/dashboard/types";

type ApplicationCardProps = {
  application: DashboardApplication;
};

const statusLabel: Record<DashboardApplication["status"], string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  COMPLETED: "Completed",
};

export function ApplicationCard({ application }: ApplicationCardProps) {
  const router = useRouter();
  const isDraft = application.status === "DRAFT";
  const isSubmitted = application.status === "SUBMITTED";

  return (
    <Card>
      <CardHeader className="gap-2 sm:flex sm:flex-row sm:items-start sm:justify-between">
        <CardTitle>{application.applicant.fullName || "Untitled application"}</CardTitle>
        <Badge variant={isDraft ? "secondary" : "outline"}>{statusLabel[application.status]}</Badge>
      </CardHeader>
      {application.referenceNumber ? (
        <CardContent className="text-muted-foreground">
          Reference number: {application.referenceNumber}
        </CardContent>
      ) : null}
      {(isDraft || isSubmitted) && (
        <CardFooter className="flex-col items-stretch gap-2 sm:flex-row sm:justify-end">
          <Button
            className="w-full sm:w-auto"
            onClick={() => router.push(`/applications/${application._id}`)}
          >
            {isDraft ? "Continue Application" : "View Application"}
          </Button>
          {isSubmitted && (
            <Button className="w-full sm:w-auto" variant="outline" disabled>
              Download Certificate
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
