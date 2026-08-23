import * as jwt from "jsonwebtoken";
import envConfig from "@/utils/configuration/environment";
import mongoose from "mongoose";

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
};

const getObjectId = (id: string) => {
  return new mongoose.Types.ObjectId(id);
};
export { getJWTToken, verifyToken, getObjectId };
