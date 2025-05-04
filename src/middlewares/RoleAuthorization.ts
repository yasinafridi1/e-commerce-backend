import { NextFunction, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { AuthenticatedRequest, UserRole } from "../types";

const roleAuthorization = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.user!.role;

    // Check if the user's role is in the allowedRoles array
    if (allowedRoles.includes(userRole)) {
      next(); // User has required role, proceed to controller
    } else {
      return next(new ErrorHandler("Unauthorized user", 400));
    }
  };
};

export default roleAuthorization;
