import { SubmissionSuccess } from "@/module/submission/components/submission-success";
import type { SubmissionDetails } from "@/module/submission/types";

type SuccessPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    referenceNumber?: string;
    status?: string;
    submittedAt?: string;
  }>;
};

export default async function SuccessPage({ params, searchParams }: SuccessPageProps) {
  const [{ id }, submission] = await Promise.all([params, searchParams]);

  const submissionDetails: SubmissionDetails = {
    applicationId: id,
    status: submission.status === "SUBMITTED" ? submission.status : "SUBMITTED",
    referenceNumber: submission.referenceNumber || "Not available",
    submittedAt: submission.submittedAt || "Not available",
  };

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <SubmissionSuccess submission={submissionDetails} />
    </main>
  );
}
