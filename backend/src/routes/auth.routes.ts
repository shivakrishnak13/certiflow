import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { validateRequest } from "@/middleware/validate.middleware";
import { catchAsync } from "@/utils/helpers/asyncHandler";

export class AuthRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.router.post(
      "/register",
      validateRequest({
        email: "required|email",
        password: "required",
        "name.first": "required",
        "name.last": "required",
      }),
      catchAsync(AuthController.register),
    );
    this.router.post(
      "/login",
      validateRequest({
        email: "required|email",
        password: "required",
      }),
      catchAsync(AuthController.login),
    );
  }
}
