import { NextFunction, Request, Response } from "express";
import AsyncWrapper from "../utils/AsyncWrapper";
import User from "../models/UserModel";
import ErrorHandler from "../utils/ErrorHandler";
import HashingService from "../services/HashingService";
import { ROLES, envVariables } from "../config/Constants";
import { generateToken, storeToken } from "../services/JwtService";
import SuccessMessage from "../utils/SuccessMessage";
import { AuthenticatedRequest } from "../types";
import { Op } from "sequelize";

export const adminLogin = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, fcmToken } = req.body;

    const user = await User.findOne({ where: { email, role: ROLES.customer } });
    if (!user) {
      return next(new ErrorHandler("Incorrect email or password", 422));
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      const unlockTime = user.lockUntil.toLocaleString();
      return next(
        new ErrorHandler(
          `Account is locked. Try again after: ${unlockTime}`,
          400
        )
      );
    }

    const comparePassword = await HashingService.compareHashed(
      password,
      user.password
    );

    if (!comparePassword) {
      user.passwordRetries += 1;

      // Lock account if tries reach 5
      if (user.passwordRetries >= envVariables.maxPasswordAttempts) {
        user.lockUntil = new Date(Date.now() + 10 * 60 * 60 * 1000);
      }

      user.save();
      return next(new ErrorHandler("Invalid email or password", 422));
    }

    user.passwordRetries = 0;
    user.lockUntil = null;
    user.fcmToken = fcmToken;
    await user.save();

    const { accessToken, refreshToken } = generateToken({
      role: ROLES.customer,
      userId: user.userId,
    });
    await storeToken(user.userId, accessToken, refreshToken);

    return SuccessMessage(res, "Login successfully", {
      adminData: user,
      accessToken,
      refreshToken,
    });
  }
);

export const registerUser = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, phoneNumber, email, gender, password } = req.body;
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phoneNumber }],
      },
    });

    if (existingUser) {
      return next(new ErrorHandler("User already exist", 409));
    }

    const hashedpassword = await HashingService.generateHash(password);

    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password,
      gender,
      role: ROLES.customer,
    });

    if (!user) {
      return next(new ErrorHandler("User creation failed", 400));
    }

    return SuccessMessage(res, "User account created successfully");
  }
);

export const getUserProfile = AsyncWrapper(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { userId } = req.user!;

    const user = await User.findOne({
      where: { userId },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    if (!user) {
      return next(new ErrorHandler("Data not found", 404));
    }

    return SuccessMessage(res, "User profile fetched successfully");
  }
);

export const updateProfile = AsyncWrapper(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { phoneNumber, fullName } = req.body;
    const { userId } = req.user!;

    await User.update({ phoneNumber, fullName }, { where: { userId } });

    const user = await User.findOne({
      where: { userId },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    if (!user) {
      return next(new ErrorHandler("Data not found", 404));
    }

    return SuccessMessage(res, "User profile fetched successfully");
  }
);
