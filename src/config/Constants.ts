require("dotenv").config();

export const envVariables = {
  port: process.env.PORT,
  dbUserName: process.env.DB_USERNAME as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbHostName: process.env.DB_HOSTNAME as string,
  dbName: process.env.DB_NAME as string,
  maxPasswordAttempts: Number(process.env.PASSWORD_ATTEMPTS) || 5,
  lockTime: process.env.LOCK_TIME || 30 * 60 * 1000,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
};

export const ROLES = {
  admin: "ADMIN",
  customer: "CUSTOMER",
};

export const GENDER = {
  male: "MALE",
  female: "FEMALE",
  other: "OTHER",
};

export const ACCOUNT_STATUS = {
  active: "ACTIVE",
  block: "BLOCKED",
};

export const PRODUCT_TYPE = {
  male: "MALE",
  female: "FEMALE",
  universal: "UNIVERSAL",
  children: "CHIDLREN",
};

export const ORDER_STATUS = {
  pending: "PENDING",
  delivered: "DELIVERED",
  recieved: "RECIEVED",
};

export const PAYMENT_TYPES = {
  stripe: "STRIPE",
  paypal: "PAYPAL",
  crypto: "CRYPTO",
};
