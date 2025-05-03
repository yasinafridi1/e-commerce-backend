import { ROLES, envVariables } from "../config/Constants";
import User from "../models/UserModel";
import { TokenPayload } from "../types";
import jwt from "jsonwebtoken";
const { accessTokenSecret, refreshTokenSecret } = envVariables;

export const generateToken = (payload: TokenPayload) => {
  const accessToken = jwt.sign(payload, accessTokenSecret, {
    expiresIn: payload.role === ROLES.admin ? "1h" : "5h",
  });

  const refreshToken = jwt.sign(payload, refreshTokenSecret, {
    expiresIn: payload.role === ROLES.admin ? "2h" : "24h",
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
