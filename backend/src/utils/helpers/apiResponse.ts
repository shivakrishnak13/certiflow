import { type Response } from "express";

import { type ApiResponseType } from "@/types/common/apiResponse";

export const ApiResponse = (params: ApiResponseType) => {
  return {
    success: params.success,
    message: params.message,
    data: params?.data || {},
    errors: params?.errors || {},
  };
};

export const SuccessResponse = (
  res: Response,
  statusCode: number,
  params: ApiResponseType,
) => {
  return res.status(statusCode).json({
    success: true,
    message: params.message,
    data: params?.data ?? {},
    errors: params?.errors ?? {},
    messageCode: params?.messageCode || undefined,
  });
};

export const ErrorResponse = (
  res: Response,
  statusCode: number,
  params: ApiResponseType,
) => {
  return res.status(statusCode).json({
    success: false,
    message: params.message,
    data: params?.data ?? {},
    errors: params?.errors ?? {},
    messageCode: params?.messageCode || undefined,
  });
};
