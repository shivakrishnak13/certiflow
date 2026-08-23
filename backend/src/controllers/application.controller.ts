import { ApplicationService } from "@/services/application.service";
import { DocumentService } from "@/services/document.service";
import { JwtUserPayload } from "@/types/express";
import { ErrorResponse, SuccessResponse } from "@/utils/helpers/apiResponse";
import {
  documentUploadSchema,
  applicationSchema,
} from "@/utils/zod/application";
import { Request, Response, NextFunction } from "express";
import status from "http-status";

export class ApplicationController {
  static async createApplication(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { id } = req.user as JwtUserPayload;

    const application = await ApplicationService.createApplication(id);
    return SuccessResponse(res, status.CREATED, {
      message: "Success.",
      data: application,
    });
  }

  static async getApplications(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { id } = req.user as JwtUserPayload;
    const applications = await ApplicationService.getApplications(id);
    return SuccessResponse(res, status.OK, {
      message: "Success.",
      data: applications,
    });
  }

  static async getApplicationById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { id } = req.params as { id: string };
    const { id: userId } = req.user as JwtUserPayload;

    const application = await ApplicationService.getApplicationById(id, userId);

    if (!application) {
      return ErrorResponse(res, status.NOT_FOUND, {
        message: "Application not found.",
      });
    }

    return SuccessResponse(res, status.OK, {
      message: "Success.",
      data: application,
    });
  }

  static async ApplicationType(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { id } = req.params as { id: string };
    const { id: userId } = req.user as JwtUserPayload;
    const parsedData = applicationSchema.safeParse(req.body);

    if (!parsedData.success) {
      return ErrorResponse(res, status.BAD_REQUEST, {
        message: "Invalid application data.",
        errors: parsedData.error.flatten(),
      });
    }

    const updatedApplication = await ApplicationService.ApplicationType(
      id,
      userId,
      parsedData.data,
    );

    if (!updatedApplication) {
      return ErrorResponse(res, status.NOT_FOUND, {
        message: "Application not found.",
      });
    }

    return SuccessResponse(res, status.OK, {
      message: "Application updated successfully.",
      data: updatedApplication,
    });
  }

  static async uploadDocument(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const { id: userId } = req.user as JwtUserPayload;
    const parsedData = documentUploadSchema.safeParse(req.body);

    if (!parsedData.success || !req.file) {
      return ErrorResponse(res, status.BAD_REQUEST, {
        message: !parsedData.success
          ? "Invalid document type."
          : "A PDF file is required.",
        errors: !parsedData.success ? parsedData.error.flatten() : {},
      });
    }

    const document = await DocumentService.uploadDocument(
      id,
      userId,
      parsedData.data.documentType,
      req.file,
    );

    if (!document) {
      return ErrorResponse(res, status.NOT_FOUND, {
        message: "Application not found.",
      });
    }

    return SuccessResponse(res, status.OK, {
      message: "Document uploaded successfully.",
      data: document,
    });
  }

  static async getDocument(req: Request, res: Response) {
    const { id, documentId } = req.params as { id: string; documentId: string };
    const { id: userId } = req.user as JwtUserPayload;

    const document = await DocumentService.getDocument(id, userId, documentId);

    if (!document) {
      return ErrorResponse(res, status.NOT_FOUND, {
        message: "Application not found.",
      });
    }

    return SuccessResponse(res, status.OK, {
      message: "Document uploaded successfully.",
      data: document,
    });
  }

  static async submitApplication(req: Request, res: Response) {
    const { id: applicationId } = req.params as { id: string };
    const { id: userId } = req.user as JwtUserPayload;

    const result = await ApplicationService.submitApplication(
      applicationId,
      userId,
    );

    if (!result) {
      return ErrorResponse(res, status.NOT_FOUND, {
        message: "Application not found.",
      });
    }

    return SuccessResponse(res, status.OK, {
      message: "Application submitted successfully.",
      data: {
        applicationId: result.application._id,
        status: result.application.status,
        referenceNumber: result.referenceNumber,
        submittedAt: result.application.submittedAt,
      },
    });
  }
}
