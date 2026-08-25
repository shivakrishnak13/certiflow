import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { AuthMiddleware } from "@/middleware/auth.middleware";
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
    this.router.get(
      "/me",
      AuthMiddleware.guard,
      AuthMiddleware.validateUserExists,
      catchAsync(AuthController.me),
    );
    this.router.post("/logout", catchAsync(AuthController.logout));
  }
}
