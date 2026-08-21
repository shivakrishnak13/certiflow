import * as jwt from "jsonwebtoken";
import envConfig from "@/utils/configuration/environment";

const JWT_SECRET: string = envConfig.JWT_SECRET;

const getJWTToken = (payload: object, expiresIn: number = 7) =>
  jwt.sign({ data: payload }, JWT_SECRET, {
    expiresIn: `${expiresIn}h`,
  });


export {
    getJWTToken,
}