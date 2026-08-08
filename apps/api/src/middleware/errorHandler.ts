import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

/**
 * Global error handler — must be registered LAST in the Express middleware chain.
 * Produces a consistent { success: false, error: { code, message, details? } } shape.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed.",
        details: err.flatten().fieldErrors,
      },
    });
    return;
  }

  // Known application errors thrown as plain objects
  if (isAppError(err)) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  // Unknown errors
  console.error("[Unhandled Error]", err);
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred. Please try again later.",
    },
  });
}

// ─── Application Error class ──────────────────────────────────────────────────

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}
