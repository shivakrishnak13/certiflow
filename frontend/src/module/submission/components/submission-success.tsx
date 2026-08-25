"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/config/routes";
import type { SubmissionDetails } from "@/module/submission/types";

type SubmissionSuccessProps = {
  submission: SubmissionDetails;
};

function formatSubmittedAt(submittedAt: string) {
  const date = new Date(submittedAt);

  return Number.isNaN(date.getTime()) ? submittedAt : date.toLocaleString();
}

export function SubmissionSuccess({ submission }: SubmissionSuccessProps) {
  const router = useRouter();

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Application submitted successfully</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <dl className="space-y-3">
          <div>
            <dt className="text-sm text-muted-foreground">Reference number</dt>
            <dd className="mt-1 font-medium">{submission.referenceNumber}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Submitted date/time</dt>
            <dd className="mt-1 font-medium">{formatSubmittedAt(submission.submittedAt)}</dd>
          </div>
        </dl>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" disabled>Download Certificate</Button>
          <Button type="button" onClick={() => router.push(routes.dashboard)}>Go to Dashboard</Button>
        </div>
      </CardContent>
    </Card>
  );
}
