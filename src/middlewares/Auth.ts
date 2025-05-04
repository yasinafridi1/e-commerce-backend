import { NextFunction, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { verifyAccessToken } from "../services/JwtService";
import { AuthenticatedRequest, DecodedUser } from "../types";
import { JwtPayload } from "jsonwebtoken";

const auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return next(new ErrorHandler("Token not provided", 403));
    }

    const user = await verifyAccessToken(accessToken);
    req.user = { role: user.role, userId: user.userId };
    next();
  } catch (error: any) {
    return next(new ErrorHandler(error.message || "JWT expired", 401));
  }
};

export default auth;
