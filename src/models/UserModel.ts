import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConnect";
import { ACCOUNT_STATUS, GENDER, ROLES } from "../config/Constants";
import { AccountStatus, Gender, UserRole } from "../types";

// Type aliases for enums

// Interface for model properties
export interface UserProps {
  userId?: number;
  role: UserRole;
  fullName: string;
  password: string;
  email: string;
  phoneNumber: string;
  isVerified: boolean;
  gender: Gender;
  status: AccountStatus;
  passwordRetries?: number;
  lockUntil?: Date | null;
  fcmToken?: string | null;
  profilePicture?: string | null;
  accessToken?: string;
  refreshToken?: string;
}

// For creation, make optional fields truly optional
export interface UserCreationProps
  extends Optional<
    UserProps,
    | "userId"
    | "isVerified"
    | "status"
    | "passwordRetries"
    | "lockUntil"
    | "fcmToken"
    | "profilePicture"
  > {}

// Model class
class User extends Model<UserProps, UserCreationProps> implements UserProps {
  public userId!: number;
  public role!: UserRole;
  public fullName!: string;
  public password!: string;
  public email!: string;
  public phoneNumber!: string;
  public isVerified!: boolean;
  public gender!: Gender;
  public status!: AccountStatus;
  public passwordRetries!: number;
  public lockUntil!: Date | null;
  public fcmToken!: string | null;
  public profilePicture!: string | null;
}

// Initialize model
User.init(
  {
    userId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(ROLES)),
      defaultValue: ROLES.customer,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [3, 100] },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { len: [5, 25] },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    gender: {
      type: DataTypes.ENUM(...Object.values(GENDER)),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ACCOUNT_STATUS)),
      allowNull: false,
      defaultValue: ACCOUNT_STATUS.block, // ensure default if needed
    },
    passwordRetries: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lockUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fcmToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accessToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    hooks: {
      afterCreate: (user: User) => {
        if (user.role === ROLES.admin) {
          user.isVerified = true;
          user.status = ACCOUNT_STATUS.active;
        }
      },
    },
  }
);

export default User;
