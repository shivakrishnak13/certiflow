import { ENV } from "@/types/enums/enums";
import envConfig from "@/utils/configuration/environment";
import { ErrorResponse } from "@/utils/helpers/apiResponse";
import { Request, Response, NextFunction } from "express";
import status from "http-status";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  const statusCode =
    res.statusCode !== status.OK
      ? res.statusCode
      : status.INTERNAL_SERVER_ERROR;

  return ErrorResponse(res, statusCode, {
    success: false,
    message: err.message || "An unexpected error occurred on the server.",
    errors: envConfig.NODE_ENV === ENV.DEVELOPMENT ? undefined : err.stack,
  });
};
