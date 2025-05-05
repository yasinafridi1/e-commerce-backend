import { ROLES, envVariables } from "../config/Constants";
import User from "../models/UserModel";
import { DecodedUser, TokenPayload } from "../types";
import jwt from "jsonwebtoken";
const { accessTokenSecret, refreshTokenSecret } = envVariables;

export const generateToken = (payload: TokenPayload) => {
  const accessToken = jwt.sign(payload, accessTokenSecret, {
    expiresIn: payload.role === ROLES.admin ? "72h" : "72h",
  });

  const refreshToken = jwt.sign(payload, refreshTokenSecret, {
    expiresIn: payload.role === ROLES.admin ? "148h" : "148h",
  });

  return { accessToken, refreshToken };
};

export const storeToken = async (
  userId: number,
  accessToken: string,
  refreshToken: string
) => {
  try {
    return await User.update(
      { accessToken, refreshToken },
      { where: { userId } }
    );
  } catch (error: any) {
    throw new error();
  }
};

export const verifyAccessToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, accessTokenSecret) as DecodedUser;

    const user = await User.findOne({
      where: { accessToken: token },
      attributes: { include: ["userId", "role"] },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return decoded;
  } catch (err) {
    const error = err as any;
    error.statusCode = 401; // Set custom status code for token verification error
    if (error.name === "JsonWebTokenError") {
      error.message = "Invalid Token";
    } else if (error.name === "TokenExpiredError") {
      error.message = "Token Expired";
    }

    throw error;
  }
};
