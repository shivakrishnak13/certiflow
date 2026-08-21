import { AuthService } from "@/services/auth.service";
import { ErrorResponse } from "@/utils/configuration/helpers/apiResponse";
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { Validator } from "node-input-validator";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;
      const validator = new Validator(req.body, {
        email: "required|email",
        password: "required",
        name: "required",
      });

      const matched = await validator.check();

      if (!matched) {
        return ErrorResponse(res, status.UNPROCESSABLE_ENTITY, {
          message: validator.errors,
          errors: validator.errors,
        });
      }

      const existingUser = await AuthService.findUserByEmail(email);
      if (existingUser) {
        return ErrorResponse(res, status.CONFLICT, {
          message: "User already exists",
        });
      }

      await AuthService.createUser(email, password, name);

      res
        .status(201)
        .json({ success: true, data: "user registered successfully" });
    } catch (error) {
      next(error);
    }
  }
}
