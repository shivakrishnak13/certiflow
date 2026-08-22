import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { corsOptions } from "@/utils/configuration/corsOptions";
import { api } from "@/routes";

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

    app.use("/api", api);

    return app;
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};
