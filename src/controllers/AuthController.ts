import { NextFunction, Request, Response } from "express";
import AsyncWrapper from "../utils/AsyncWrapper";
import {
  generateToken,
  storeToken,
  verifyRefreshToken,
} from "../services/JwtService";
import SuccessMessage from "../utils/SuccessMessage";
import User from "../models/UserModel";
import ErrorHandler from "../utils/ErrorHandler";
import { ROLES } from "../config/Constants";
import { adminDto } from "../services/DTOs/UserDto";

export const autoLogin = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken: refrestTokenFromBody } = req.body;
    const { userId, role } = verifyRefreshToken(refrestTokenFromBody);
    const { accessToken, refreshToken } = generateToken({ role, userId });
    await storeToken(userId, accessToken, refreshToken);
    const user = await User.findOne({ where: { userId, role } });
    if (!user) {
      return next(new ErrorHandler("User not found", 403));
    }

    let userData = null;
    if (role === ROLES.admin) {
      userData = adminDto(user);
    }
    return SuccessMessage(res, "Token refreshed successfully", {
      accessToken,
      refreshToken,
      userData,
    });
  }
);
