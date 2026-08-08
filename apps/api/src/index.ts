import "express-async-errors";
import "dotenv/config";

import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import { errorHandler } from "./middleware/errorHandler";
import apiRouter from "./routes/index";

const app: Express = express();
const PORT = process.env["PORT"] ? parseInt(process.env["PORT"], 10) : 3001;

// ─── Security & Infra Middleware ──────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env["CORS_ORIGIN"] ?? "http://localhost:3000",
    credentials: true,
  }),
);
app.use(compression());
app.use(morgan(process.env["NODE_ENV"] === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), service: "freightbridge-api" });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api", apiRouter);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "The requested endpoint does not exist." },
  });
});

// ─── Global Error Handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.info(`🚚 FreightBridge API running on http://localhost:${PORT}`);
  console.info(`   Environment: ${process.env["NODE_ENV"] ?? "development"}`);
});

export default app;
