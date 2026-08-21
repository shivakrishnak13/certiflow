import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";

export const createApp = (): Application => {
  try {
    const app = express();

    /**
     * ---------------------------------
     *            Middlewares
     * ---------------------------------
     */

    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    

    return app;
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};
