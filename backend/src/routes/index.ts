import { Router } from "express";
import { AuthRouter } from "@/routes/auth.routes";
import { AuthMiddleware } from "@/middleware/auth.middleware";
import { catchAsync } from "@/utils/helpers/asyncHandler";
import { ApplicationRouter } from "@/routes/application.routes";

export const api = Router();

api.use("/auth", new AuthRouter().router);

api.use(catchAsync(AuthMiddleware.guard));

api.get("/test", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

api.use("/applications", new ApplicationRouter().router);
