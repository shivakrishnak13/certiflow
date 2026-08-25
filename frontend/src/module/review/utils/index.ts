import type { ErrorResponseType } from "@/lib/api";
import type { ApplicantDetails } from "@/module/applicant-details/types";
import { isAxiosError } from "axios";

export function getApiError(error: unknown) {
  return isAxiosError<ErrorResponseType>(error) ? error.response?.data.message : null;
}

export function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatAddress(address?: ApplicantDetails["address"]) {
  const parts = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postalCode,
  ].filter(Boolean);

  return parts.join(", ") || undefined;
}