import { ApplicationStepper } from "@/components/common/application-stepper";
import { PageHeading } from "@/components/common/page-heading";
import { ApplicantDetailsForm } from "@/module/applicant-details/components/applicant-details-form";

type ApplicantDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ApplicantDetailsPage({ params }: ApplicantDetailsPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <ApplicationStepper currentStep={1} />

      <PageHeading
        title="Applicant Details"
        description="Tell us who the provisional certificate should be issued to."
      />

      <ApplicantDetailsForm applicationId={id} />
    </div>
  );
}
