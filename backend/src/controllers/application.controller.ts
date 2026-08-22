import { ApplicationService } from "@/services/application.service";
import { JwtUserPayload } from "@/types/express";
import { ErrorResponse, SuccessResponse } from "@/utils/helpers/apiResponse";
import { Request, Response, NextFunction } from "express";
import status from "http-status";

export class ApplicationController {
  static async createApplication(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { id } = req.user as JwtUserPayload;
    console.log("User ID from JWT:", id);
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
    const application = await ApplicationService.getApplicationById(id);
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
}
