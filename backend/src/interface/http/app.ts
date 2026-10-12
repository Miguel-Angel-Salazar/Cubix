import cors from "cors";
import express from "express";
import { env } from "../../config/env";
import { healthRouter } from "./routes/health.routes";

export const app = express();

app.use(cors({ origin: env.frontendUrl }));
app.use(express.json());
app.use("/api/health", healthRouter);
