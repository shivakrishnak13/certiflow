import { ApplicationController } from "@/controllers/application.controller";
import { catchAsync } from "@/utils/helpers/asyncHandler";
import { Router } from "express";

export class ApplicationRouter {
    router: Router;
    constructor () {
        this.router = Router();

        this.router.post('/', catchAsync(ApplicationController.createApplication));
        this.router.get('/', catchAsync(ApplicationController.getApplications));
        this.router.get('/:id', catchAsync(ApplicationController.getApplicationById));

    }
}