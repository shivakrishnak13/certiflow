import { AuthService } from "@/services/auth.service";
import { COOKIE_NAME } from "@/types/enums/enums";
import { cookieOptions } from "@/utils/configuration/cookieOptions";
import { ErrorResponse, SuccessResponse } from "@/utils/helpers/apiResponse";
import { getJWTToken } from "@/utils/helpers/commonHelpers";
import { NextFunction, Request, Response } from "express";
import status from "http-status";

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

    res.cookie(COOKIE_NAME.TOKEN, token, cookieOptions);

    return SuccessResponse(res, status.OK, {
      message: "Success.",
      data: { user: userResponse },
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

    res.cookie(COOKIE_NAME.TOKEN, token, cookieOptions);

    return SuccessResponse(res, status.OK, {
      message: "Success.",
      data: { user: userResponse },
    });
  }
}
