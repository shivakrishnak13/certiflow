import { ApplicationStepper } from "@/components/common/application-stepper";
import { PageHeading } from "@/components/common/page-heading";
import { ReviewStep } from "@/module/review/components/review-step";

type ReviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <ApplicationStepper currentStep={3} />

      <PageHeading
        title="Review Application"
        description="Check your details and documents before submitting. You can go back to make changes."
      />

      <ReviewStep applicationId={id} />
    </div>
  );
}
