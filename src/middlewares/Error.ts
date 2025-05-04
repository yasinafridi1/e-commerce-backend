import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import logError from "../utils/errorLogger";
import { ZodError } from "zod";
// Extending the ZodError type
interface CustomZodError extends ZodError {
  customMessage?: string;
  statusCode?: number;
}

const ErrorMiddleware: ErrorRequestHandler = (err: any, req, res, next) => {
  logError(err);
  console.log("Error ==>", err);
  // Log specific details of the error to ensure it's a ZodError
  // Default error message and status code
  err.customMessage = err.message || "Internal server error";
  err.statusCode = err?.statusCode || 500;

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const message = err.errors[0].message;
    // .map((e: { message: string }) => e.message)
    // .join(", ");
    (err as CustomZodError).customMessage = message;
    (err as CustomZodError).statusCode = 422;
  }

  // Use res.send() to send a response, but avoid returning anything
  res.status(err.statusCode).json({
    success: false,
    message: err.customMessage,
  });

  // We should not return anything here to conform to Express standards
};

export default ErrorMiddleware;
