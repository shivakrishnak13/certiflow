import * as jwt from "jsonwebtoken";
import envConfig from "@/utils/configuration/environment";

const JWT_SECRET: string = envConfig.JWT_SECRET;

const getJWTToken = (payload: object, expiresIn: number = 7) =>
  jwt.sign({ data: payload }, JWT_SECRET, {
    expiresIn: `${expiresIn}h`,
  });

const verifyToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

export {
    getJWTToken,
    verifyToken,
}