import { NextFunction, Request, Response } from "express";
import logError from "../utils/errorLogger";
import { ZodError } from "zod";

// Extending the ZodError type
interface CustomZodError extends ZodError {
  customMessage?: string; // Add customMessage property
  statusCode?: number;
}

const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logError(err);

  // Default error message and status code
  err.customMessage = err.message || "Internal server error"; // Use a custom message field
  err.statusCode = err?.statusCode || 500;

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const message = err.errors
      .map((e: { message: string }) => e.message)
      .join(", ");
    (err as CustomZodError).customMessage = message; // Type cast to CustomZodError
    (err as CustomZodError).statusCode = 422;
  }

  console.log(err);

  return res.status(err.statusCode).json({
    success: false,
    message: err.customMessage, // Use the custom message field
  });
};

module.exports = ErrorMiddleware;
