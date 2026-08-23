import { ApplicationController } from "@/controllers/application.controller";
import { uploadDocument } from "@/config/multer";
import { catchAsync } from "@/utils/helpers/asyncHandler";
import { Router } from "express";

export class ApplicationRouter {
  router: Router;
  constructor() {
    this.router = Router();

    this.router.post("/", catchAsync(ApplicationController.createApplication));
    this.router.get("/", catchAsync(ApplicationController.getApplications));
    this.router.get(
      "/:id",
      catchAsync(ApplicationController.getApplicationById),
    );
    this.router.patch(
      "/:id",
      catchAsync(ApplicationController.updateApplication),
    );

    this.router.post(
      "/:id/documents",
      uploadDocument,
      catchAsync(ApplicationController.uploadDocument),
    );
  }
}
