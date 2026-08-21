import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";

export class AuthRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.router.post("/register", AuthController.register);
    this.router.post("/login", AuthController.login);
  }
}
