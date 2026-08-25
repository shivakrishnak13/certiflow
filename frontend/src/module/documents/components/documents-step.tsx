"use client";

import { isAxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import { useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/config/routes";
import type { ErrorResponseType } from "@/lib/api";
import { useApplicationDetails } from "@/module/applicant-details/hooks/useApplicationDetails";
import type { ApplicationDocument, ApplicationDocumentType } from "@/module/applicant-details/types";
import { usePreviewDocument } from "@/module/documents/hooks/usePreviewDocument";
import { useUploadDocument } from "@/module/documents/hooks/useUploadDocument";
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
    <section className="rounded-xl border p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-medium">{label}</h2>
          {document ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {document.originalName} · {formatFileSize(document.size)}
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">PDF only, up to 5 MB.</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {document && (
            <Button type="button" variant="outline" onClick={handlePreview} disabled={previewDocument.isPending}>
              {previewDocument.isPending ? <LoaderCircle className="animate-spin" /> : null}
              Preview
            </Button>
          )}
          <Button type="button" onClick={() => inputRef.current?.click()} disabled={uploadDocument.isPending}>
            {uploadDocument.isPending ? <LoaderCircle className="animate-spin" /> : null}
            {document ? "Replace" : "Upload"}
          </Button>
        </div>
      </div>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />
      {fileError && <p className="mt-3 text-sm text-destructive">{fileError}</p>}
      {uploadDocument.isError && <p className="mt-3 text-sm text-destructive">{uploadError || "Unable to upload the document. Please try again."}</p>}
      {previewDocument.isError && <p className="mt-3 text-sm text-destructive">{previewError || "Unable to preview the document. Please try again."}</p>}
      {uploadSuccess && <p className="mt-3 text-sm text-green-700">Document uploaded successfully.</p>}
    </section>
  );
}

export function DocumentsStep({ applicationId }: DocumentsStepProps) {
  const router = useRouter();
  const hasMounted = useSyncExternalStore(subscribe, () => true, () => false);
  const applicationQuery = useApplicationDetails(applicationId, hasMounted);

  if (!hasMounted || applicationQuery.isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground" role="status">
        <LoaderCircle className="size-4 animate-spin" />
        Loading documents...
      </div>
    );
  }

  if (applicationQuery.isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="font-medium">Unable to load documents</p>
        <p className="mt-1 text-sm text-muted-foreground">{getApiError(applicationQuery.error) || "Please try again."}</p>
        <Button className="mt-4" variant="outline" onClick={() => router.push(routes.applications.details(applicationId))}>
          Back to details
        </Button>
      </div>
    );
  }

  const documents = applicationQuery.data?.documents || [];
  const idProof = documents.find((document) => document.type === "ID_PROOF");
  const degreeCertificate = documents.find((document) => document.type === "DEGREE_CERTIFICATE");
  const canContinue = Boolean(idProof && degreeCertificate);

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DocumentSection applicationId={applicationId} documentType="ID_PROOF" label="ID Proof" document={idProof} />
        <DocumentSection applicationId={applicationId} documentType="DEGREE_CERTIFICATE" label="Degree Certificate" document={degreeCertificate} />
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => router.push(routes.applications.details(applicationId))}>
            Back
          </Button>
          <Button type="button" onClick={() => router.push(routes.applications.review(applicationId))} disabled={!canContinue}>
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
