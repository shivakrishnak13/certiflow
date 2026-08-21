// This file contains constant error codes used throughout the application.

export const ERROR_CODES = {
  EMAIL_NOT_FOUND: "EMAIL_NOT_FOUND",
  INVALID_PASSWORD: "INVALID_PASSWORD",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  INVALID_OTP: "INVALID_OTP",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
