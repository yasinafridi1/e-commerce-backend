import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { UserRole } from "../types";

interface CustomRequest extends Request {
  user: {
    role: UserRole;
  };
}

const roleAuthorization = (allowedRoles: UserRole) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const userRole = req.user.role; // Assumes user role is available on req.user

    // Check if the user's role is in the allowedRoles array
    if (allowedRoles.includes(userRole)) {
      next(); // User has required role, proceed to controller
    } else {
      return next(new ErrorHandler("Unauthorized user", 400));
    }
  };
};

module.exports = roleAuthorization;
