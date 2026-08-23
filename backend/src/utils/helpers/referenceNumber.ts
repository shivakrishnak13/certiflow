import { randomBytes } from "node:crypto";

export const generateReferenceNumber = (): string => {
  const random = randomBytes(4)
    .toString("hex")
    .toUpperCase();

  return `CERT-${Date.now()}-${random}`;
};