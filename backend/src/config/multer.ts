import multer from "multer";
import { ErrorResponse } from "@/utils/helpers/apiResponse";
import { sanitizePdf } from "@/utils/helpers/pdf";
import { NextFunction, Request, Response } from "express";
import status from "http-status";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF files are allowed."));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
  },
  fileFilter,
});

export const uploadDocument = (req: Request, res: Response, next: NextFunction) => {
  upload.single("file")(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      const statusCode = error.code === "LIMIT_FILE_SIZE"
        ? status.REQUEST_ENTITY_TOO_LARGE
        : status.BAD_REQUEST;

      return ErrorResponse(res, statusCode, {
        message: error.code === "LIMIT_FILE_SIZE"
          ? "The PDF must be 5 MB or smaller."
          : "Invalid document upload.",
        errors: { file: error.message },
      });
    }

    if (error) {
      return ErrorResponse(res, status.BAD_REQUEST, {
        message: error instanceof Error ? error.message : "Invalid document upload.",
      });
    }

    if (!req.file) {
      return ErrorResponse(res, status.BAD_REQUEST, {
        message: "A PDF file is required.",
      });
    }

    try {
      req.file.buffer = sanitizePdf(req.file.buffer);
      return next();
    } catch (sanitizationError) {
      return ErrorResponse(res, status.BAD_REQUEST, {
        message: sanitizationError instanceof Error
          ? sanitizationError.message
          : "The PDF could not be validated.",
      });
    }
  });
};
