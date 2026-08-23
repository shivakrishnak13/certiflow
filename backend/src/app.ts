import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { corsOptions } from "@/utils/configuration/corsOptions";
import { api } from "@/routes";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.middleware";

export const createApp = (): Application => {
  try {
    const app = express();

    /**
     * ---------------------------------
     *            Middlewares
     * ---------------------------------
     */

    app.use(helmet());
    app.use(cors(corsOptions));
    app.use(express.json());

    app.use(cookieParser());

    app.use("/api", api);

    app.use(errorHandler);

    return app;
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};
