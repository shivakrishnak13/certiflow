import { DocumentsStep } from "@/module/documents/components/documents-step";

type DocumentsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DocumentsPage({ params }: DocumentsPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <DocumentsStep applicationId={id} />
    </main>
  );
}
