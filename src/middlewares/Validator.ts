import { NextFunction, Request, Response } from "express";

export const ValidateBody = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      throw error;
    }
  };
};

// Middleware to validate `req.params`
export const validateParams = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params); // Validates req.params using Zod
      next(); // If validation passes, continue to next middleware or route handler
    } catch (err) {
      throw err;
    }
  };
};
