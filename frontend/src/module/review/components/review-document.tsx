import { CircleCheck, Eye, FileText, LoaderCircle } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/class-names";
import { ApplicationDocument } from "@/module/applicant-details/types";
import { usePreviewDocument } from "@/module/documents/hooks/usePreviewDocument";
import { formatFileSize, getApiError } from "@/module/review/utils";

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
    <div className="rounded-lg border p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              document ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
            )}
          >
            {document ? (
              <CircleCheck aria-hidden="true" className="size-4.5" />
            ) : (
              <FileText aria-hidden="true" className="size-4.5" />
            )}
          </span>

          <div className="min-w-0">
            <p className="text-sm font-medium">{label}</p>
            {document ? (
              <>
                <p className="mt-0.5 truncate text-sm" title={document.originalName}>
                  {document.originalName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(document.size)}
                </p>
              </>
            ) : (
              <p className="mt-0.5 text-sm text-muted-foreground">Not uploaded</p>
            )}
          </div>
        </div>

        {document && (
          <Button
            type="button"
            variant="outline"
            size="xl"
            className="w-full shrink-0 sm:w-auto"
            aria-label={`Preview ${label}`}
            onClick={handlePreview}
            disabled={previewDocument.isPending}
          >
            {previewDocument.isPending ? (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            ) : (
              <Eye aria-hidden="true" />
            )}
            Preview
          </Button>
        )}
      </div>

      {previewDocument.isError && (
        <Alert className="mt-3">
          {previewError || "Unable to preview the document. Please try again."}
        </Alert>
      )}
    </div>
  );
}
