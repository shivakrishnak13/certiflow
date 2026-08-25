"use client";

import { isAxiosError } from "axios";
import { ArrowRight, CircleCheck, Eye, FileText, LoaderCircle, Upload } from "lucide-react";
import { useRef, useState, useSyncExternalStore } from "react";
import { ErrorState } from "@/components/common/error-state";
import { LoadingPanel } from "@/components/common/loading-panel";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { routes } from "@/config/routes";
import type { ErrorResponseType } from "@/lib/api";
import { useApplicationDetails } from "@/module/applicant-details/hooks/useApplicationDetails";
import type { ApplicationDocument, ApplicationDocumentType } from "@/module/applicant-details/types";
import { usePreviewDocument } from "@/module/documents/hooks/usePreviewDocument";
import { useUploadDocument } from "@/module/documents/hooks/useUploadDocument";
import { cn } from "@/lib/utils/class-names";
import { useRouter } from "next/navigation";

type DocumentsStepProps = {
  applicationId: string;
};

type DocumentSectionProps = {
  applicationId: string;
  documentType: ApplicationDocumentType;
  label: string;
  document?: ApplicationDocument;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const subscribe = () => () => undefined;

function getApiError(error: unknown) {
  return isAxiosError<ErrorResponseType>(error) ? error.response?.data.message : null;
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function DocumentSection({ applicationId, documentType, label, document }: DocumentSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const uploadDocument = useUploadDocument(applicationId);
  const previewDocument = usePreviewDocument(applicationId);
  const uploadError = getApiError(uploadDocument.error);
  const previewError = getApiError(previewDocument.error);
  const isUploading = uploadDocument.isPending;
  const inputId = `upload-${documentType}`;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    setFileError(null);
    setUploadSuccess(false);

    if (!file) return;

    if (file.type !== "application/pdf") {
      setFileError("Please choose a PDF file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError("The file must be 5 MB or smaller.");
      return;
    }

    uploadDocument.mutate(
      { documentType, file },
      { onSuccess: () => setUploadSuccess(true) },
    );
  };

  const handlePreview = () => {
    if (!document) return;

    previewDocument.mutate(document.id, {
      onSuccess: ({ url }) => {
        window.open(url, "_blank", "noopener,noreferrer");
      },
    });
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              document ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
            )}
          >
            {document ? (
              <CircleCheck aria-hidden="true" className="size-5" />
            ) : (
              <FileText aria-hidden="true" className="size-5" />
            )}
          </span>

          <div className="min-w-0 flex-1">
            <h2 className="font-medium">{label}</h2>

            {document ? (
              <>
                <p className="mt-0.5 truncate text-sm" title={document.originalName}>
                  {document.originalName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(document.size)} &middot; Uploaded
                </p>
              </>
            ) : (
              <p className="mt-0.5 text-sm text-muted-foreground">
                PDF only &middot; Maximum 5 MB
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {document && (
            <Button
              type="button"
              variant="outline"
              size="xl"
              className="w-full sm:w-auto"
              onClick={handlePreview}
              disabled={previewDocument.isPending || isUploading}
            >
              {previewDocument.isPending ? (
                <LoaderCircle aria-hidden="true" className="animate-spin" />
              ) : (
                <Eye aria-hidden="true" />
              )}
              Preview
            </Button>
          )}

          <Button
            type="button"
            size="xl"
            variant={document ? "outline" : "default"}
            className="w-full sm:w-auto"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            ) : (
              <Upload aria-hidden="true" />
            )}
            {isUploading ? "Uploading..." : document ? "Replace PDF" : "Upload PDF"}
          </Button>
        </div>

        <input
          ref={inputRef}
          id={inputId}
          className="sr-only"
          type="file"
          accept="application/pdf"
          aria-label={`Upload ${label} as a PDF file`}
          onChange={handleFileChange}
        />

        {isUploading && (
          <Alert variant="info">Uploading {label}. Please wait...</Alert>
        )}
        {fileError && <Alert>{fileError}</Alert>}
        {uploadDocument.isError && (
          <Alert>{uploadError || "Unable to upload the document. Please try again."}</Alert>
        )}
        {previewDocument.isError && (
          <Alert>{previewError || "Unable to preview the document. Please try again."}</Alert>
        )}
        {uploadSuccess && !isUploading && (
          <Alert variant="success">{label} uploaded successfully.</Alert>
        )}
      </CardContent>
    </Card>
  );
}

export function DocumentsStep({ applicationId }: DocumentsStepProps) {
  const router = useRouter();
  const hasMounted = useSyncExternalStore(subscribe, () => true, () => false);
  const applicationQuery = useApplicationDetails(applicationId, hasMounted);

  if (!hasMounted || applicationQuery.isLoading) {
    return <LoadingPanel label="Loading documents..." rows={2} />;
  }

  if (applicationQuery.isError) {
    return (
      <ErrorState
        title="Unable to load documents"
        description={getApiError(applicationQuery.error) || "Please try again."}
        action={
          <Button
            variant="outline"
            size="xl"
            onClick={() => router.push(routes.applications.details(applicationId))}
          >
            Back to details
          </Button>
        }
      />
    );
  }

  const documents = applicationQuery.data?.documents || [];
  const idProof = documents.find((document) => document.type === "ID_PROOF");
  const degreeCertificate = documents.find((document) => document.type === "DEGREE_CERTIFICATE");
  const uploadedCount = [idProof, degreeCertificate].filter(Boolean).length;
  const canContinue = Boolean(idProof && degreeCertificate);

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-muted-foreground">
        {uploadedCount} of 2 documents uploaded
      </p>

      <DocumentSection applicationId={applicationId} documentType="ID_PROOF" label="ID Proof" document={idProof} />
      <DocumentSection applicationId={applicationId} documentType="DEGREE_CERTIFICATE" label="Degree Certificate" document={degreeCertificate} />

      {!canContinue && (
        <p className="text-sm text-muted-foreground">
          Upload both documents to continue to the review step.
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="xl"
          className="w-full sm:w-auto"
          onClick={() => router.push(routes.applications.details(applicationId))}
        >
          Back
        </Button>

        <Button
          type="button"
          size="xl"
          className="w-full sm:w-auto"
          onClick={() => router.push(routes.applications.review(applicationId))}
          disabled={!canContinue}
        >
          Continue
          <ArrowRight aria-hidden="true" data-icon="inline-end" />
        </Button>
      </div>
    </div>
  );
}
