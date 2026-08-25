import { ApplicantDetailsForm } from "@/module/applicant-details/components/applicant-details-form";

type ApplicantDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ApplicantDetailsPage({ params }: ApplicantDetailsPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <ApplicantDetailsForm applicationId={id} />
    </main>
  );
}
