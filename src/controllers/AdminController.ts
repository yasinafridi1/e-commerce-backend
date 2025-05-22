import { NextFunction, Request, Response } from "express";
import AsyncWrapper from "../utils/AsyncWrapper";
import User from "../models/UserModel";
import ErrorHandler from "../utils/ErrorHandler";
import HashingService from "../services/HashingService";
import { ROLES, envVariables } from "../config/Constants";
import { generateToken, storeToken } from "../services/JwtService";
import SuccessMessage from "../utils/SuccessMessage";
import { AuthenticatedRequest } from "../types";
import { adminDto } from "../services/DTOs/UserDto";

export const adminLogin = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, fcmToken } = req.body;

    const admin = await User.findOne({ where: { email, role: ROLES.admin } });
    if (!admin) {
      return next(new ErrorHandler("Incorrect email or password", 422));
    }

    if (admin.lockUntil && admin.lockUntil > new Date()) {
      const unlockTime = admin.lockUntil.toLocaleString();
      return next(
        new ErrorHandler(
          `Account is locked. Try again after: ${unlockTime}`,
          400
        )
      );
    }

    const comparePassword = await HashingService.compareHashed(
      password,
      admin.password
    );

    if (!comparePassword) {
      admin.passwordRetries += 1;

      // Lock account if tries reach 5
      if (admin.passwordRetries >= envVariables.maxPasswordAttempts) {
        admin.lockUntil = new Date(Date.now() + 10 * 60 * 60 * 1000);
      }

      admin.save();
      return next(new ErrorHandler("Incorrect email or password", 422));
    }

    admin.passwordRetries = 0;
    admin.lockUntil = null;
    admin.fcmToken = fcmToken;
    await admin.save();

    const { accessToken, refreshToken } = generateToken({
      role: ROLES.admin,
      userId: admin.userId,
    });

    await storeToken(admin.userId, accessToken, refreshToken);

    return SuccessMessage(res, "Login successfully", {
      adminData: adminDto(admin),
      accessToken,
      refreshToken,
    });
  }
);

export const getAdminProfile = AsyncWrapper(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { userId } = req.user!;

    const admin = await User.findOne({
      where: { userId },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    if (!admin) {
      return next(new ErrorHandler("Data not found", 404));
    }

    return SuccessMessage(
      res,
      "Admin profile fetched successfully",
      adminDto(admin)
    );
  }
);

export const updateProfile = AsyncWrapper(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { phoneNumber, fullName } = req.body;
    const { userId } = req.user!;

    await User.update({ phoneNumber, fullName }, { where: { userId } });

    const admin = await User.findOne({
      where: { userId },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    if (!admin) {
      return next(new ErrorHandler("Data not found", 404));
    }

    return SuccessMessage(
      res,
      "Admin profile fetched successfully",
      adminDto(admin)
    );
  }
);
