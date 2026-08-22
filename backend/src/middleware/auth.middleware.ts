import { User } from "@/models/user";
import { ErrorResponse } from "@/utils/helpers/apiResponse";
import { verifyToken } from "@/utils/helpers/commonHelpers";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export class AuthMiddleware {
  public static guard = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    try {
      const token = AuthMiddleware.extractToken(req);

      if (!token) {
        return AuthMiddleware.sendUnauthorized(
          res,
          "Access denied. No token provided.",
        );
      }

      const decoded = await verifyToken(token);

      // attach payload
      req.user = {
        id: decoded.data._id || decoded.id,
        email: decoded.data.email || decoded.email,
      };
      console.log("Decoded Token:", decoded);
      return next();
    } catch (error) {

      return AuthMiddleware.sendUnauthorized(
        res,
        "Invalid or expired session token.",
      );
    }
  };

  public static validateUserExists = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    if (!req.user?.id) {
      return AuthMiddleware.sendUnauthorized(res, "Authentication required.");
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return AuthMiddleware.sendUnauthorized(
        res,
        "User account no longer exists.",
      );
    }

    req.user = user;
    return next();
  };

  private static extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.split(" ")[1];
    }

    if (req.cookies && req.cookies.token) {
      return req.cookies.token;
    }

    return null;
  }

  private static sendUnauthorized(res: Response, message: string) {
    return ErrorResponse(res, httpStatus.UNAUTHORIZED, { message });
  }
}
