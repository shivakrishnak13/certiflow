import { AuthService } from "@/services/auth.service";
import { ErrorResponse, SuccessResponse } from "@/utils/helpers/apiResponse";
import { getJWTToken } from "@/utils/helpers/commonHelpers";
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { Validator } from "node-input-validator";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    const { email, password, name } = req.body;

    const existingUser = await AuthService.findUserByEmail(email);
    if (existingUser) {
      return ErrorResponse(res, status.CONFLICT, {
        message: "User already exists",
      });
    }

    const user = await AuthService.createUser(email, password, name);
    const token = getJWTToken({ id: user._id, email: user.email });

    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    return SuccessResponse(res, status.OK, {
      message: "Success.",
      data: { user: userResponse, token },
    });
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const user = await AuthService.loginUser(email, password);
    const token = getJWTToken({ id: user._id, email: user.email });
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    return SuccessResponse(res, status.OK, {
      message: "Success.",
      data: { user: userResponse, token },
    });
  }
}
