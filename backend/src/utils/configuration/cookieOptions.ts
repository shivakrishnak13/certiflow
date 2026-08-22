import { ENV } from "@/types/enums/enums";
import envConfig from "@/utils/configuration/environment";
import { CookieOptions } from "express";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: envConfig.NODE_ENV === ENV.PRODUCTION,
  sameSite: envConfig.NODE_ENV === ENV.PRODUCTION ? "none" : "lax",
  path: "/",
  domain: envConfig.COOKIE_DOMAIN_NAME,
};
