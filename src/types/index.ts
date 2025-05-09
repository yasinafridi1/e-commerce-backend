import { Request } from "express";
import { ACCOUNT_STATUS, GENDER, ROLES } from "../config/Constants";

export type UserRole = (typeof ROLES)[keyof typeof ROLES];
export type Gender = (typeof GENDER)[keyof typeof GENDER];
export type AccountStatus =
  (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];

export interface TokenPayload {
  role: UserRole;
  userId: number;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    role: string;
    userId: number;
  };
}

export interface DecodedUser {
  role: UserRole;
  userId: number;
  iat: number;
  exp: number;
}
