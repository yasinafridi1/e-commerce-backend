import { NextFunction, Request, Response } from "express";
import AsyncWrapper from "../utils/AsyncWrapper";
import User from "../models/UserModel";
import ErrorHandler from "../utils/ErrorHandler";
import HashingService from "../services/HashingService";
import { ROLES, envVariables } from "../config/Constants";
import { generateToken, storeToken } from "../services/JwtService";
import SuccessMessage from "../utils/SuccessMessage";
import { AccountStatus, AuthenticatedRequest, PaginationQuery } from "../types";
import { adminDto } from "../services/DTOs/UserDto";
import { Op } from "sequelize";

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

/*

            ============================================================
                              CUSTOMER FUNCTION
            ============================================================
*/

export const getAllCustomers = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, search, status, gender }: PaginationQuery = req.query;
    let pageNumber = parseInt(page as string, 10);
    let limitNumber = parseInt(limit as string, 10);

    pageNumber = isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber; // check if page is number or not less than 1
    limitNumber = isNaN(limitNumber) || limitNumber < 1 ? 10 : limitNumber; // check if limit is number or not less than 1

    const offset = limitNumber * (pageNumber - 1);
    const where: any = {
      role: ROLES.customer,
    };

    if (search) {
      where[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phoneNumber: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (gender) {
      where.gender = gender;
    }

    const users = await User.findAll({
      where,
      attributes: [
        "userId",
        "role",
        "fullName",
        "email",
        "phoneNumber",
        "isVerified",
        "gender",
        "status",
        "profilePicture",
        "createdAt", // ✅ added
        "updatedAt", // ✅ added
      ],
      limit: limitNumber,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const totalUsers = await User.count({ where: { role: ROLES.customer } });
    const totalPages = Math.ceil(totalUsers / limitNumber);
    return SuccessMessage(res, "Customers fetched successfully", {
      users,
      totalRecords: totalUsers,
      totalPages,
      currentPage: pageNumber,
      limit: limitNumber,
    });
  }
);

export const updateCustomerStatus = AsyncWrapper(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { status } = req.body;
    const customer = await User.findOne({
      where: { userId, role: ROLES.customer },
    });
    if (!customer) {
      return next(new ErrorHandler("Customer not found", 404));
    }
    await User.update({ status }, { where: { userId } });
    return SuccessMessage(res, "Customer updated successfully", {
      user: customer.userId,
      status,
    });
  }
);

export const deleteCustomer = AsyncWrapper(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const customer = await User.findOne({
      where: { userId, role: ROLES.customer },
    });
    if (!customer) {
      return next(new ErrorHandler("Customer not found", 404));
    }
    await User.destroy({ where: { userId } });
    return SuccessMessage(res, "Customer deleted successfully", {
      user: customer.userId,
    });
  }
);

export const getCustomerDetail = AsyncWrapper(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {}
);
