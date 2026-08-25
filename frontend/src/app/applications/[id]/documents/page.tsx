import { ApplicationStepper } from "@/components/common/application-stepper";
import { PageHeading } from "@/components/common/page-heading";
import { DocumentsStep } from "@/module/documents/components/documents-step";

type DocumentsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DocumentsPage({ params }: DocumentsPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <ApplicationStepper currentStep={2} />

      <PageHeading
        title="Documents"
        description="Upload your ID proof and degree certificate as PDF files."
      />

      <DocumentsStep applicationId={id} />
    </div>
  );
}
