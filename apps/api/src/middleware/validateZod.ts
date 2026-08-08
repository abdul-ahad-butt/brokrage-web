import { type Request, type Response, type NextFunction } from "express";
import { type AnyZodObject, ZodError } from "zod";
import { AppError } from "./errorHandler";

export const validateBody =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new AppError(400, "VALIDATION_ERROR", "Invalid request body", error.errors);
      }
      next(error);
    }
  };

export const validateQuery =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new AppError(400, "VALIDATION_ERROR", "Invalid query parameters", error.errors);
      }
      next(error);
    }
  };
