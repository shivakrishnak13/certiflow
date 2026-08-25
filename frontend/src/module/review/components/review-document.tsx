import { Button } from "@/components/ui/button";
import { ApplicationDocument } from "@/module/applicant-details/types";
import { usePreviewDocument } from "@/module/documents/hooks/usePreviewDocument";
import { formatFileSize, getApiError } from "@/module/review/utils";
import { LoaderCircle } from "lucide-react";

type ReviewDocumentProps = {
  applicationId: string;
  label: string;
  document?: ApplicationDocument;
};

export function ReviewDocument({ applicationId, label, document }: ReviewDocumentProps) {
  const previewDocument = usePreviewDocument(applicationId);
  const previewError = getApiError(previewDocument.error);

  const handlePreview = () => {
    if (!document) return;

    previewDocument.mutate(document.id, {
      onSuccess: ({ url }) => {
        window.open(url, "_blank", "noopener,noreferrer");
      },
    });
  };

  return (
    <div className="rounded-xl border p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">{label}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {document ? `${document.originalName} · ${formatFileSize(document.size)}` : "Not uploaded"}
          </p>
        </div>
        {document && (
          <Button type="button" variant="outline" onClick={handlePreview} disabled={previewDocument.isPending}>
            {previewDocument.isPending ? <LoaderCircle className="animate-spin" /> : null}
            Preview
          </Button>
        )}
      </div>
      {previewDocument.isError && (
        <p className="mt-3 text-sm text-destructive">{previewError || "Unable to preview the document. Please try again."}</p>
      )}
    </div>
  );
}