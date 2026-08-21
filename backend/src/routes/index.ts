import { Router } from "express";
import { AuthRouter } from "@/routes/auth.routes";

export const api = Router();

api.use("/auth", new AuthRouter().router);
