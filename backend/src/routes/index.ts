import { Router } from "express";
import { AuthRouter } from "@/routes/auth.routes";
import { AuthMiddleware } from "@/middleware/auth.middleware";
import { catchAsync } from "@/utils/helpers/asyncHandler";

export const api = Router();

api.use("/auth", new AuthRouter().router);

api.get("/test", catchAsync(AuthMiddleware.guard), (req, res) => {
  res.json({ message: "Welcome to the API" });
});
