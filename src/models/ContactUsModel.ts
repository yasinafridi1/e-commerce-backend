import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/dbConnect";
import User from "./UserModel";

export interface ContactProps {
  id?: number;
  userId: number;
  subject: string;
  description: string;
  isReplayed: boolean;
  media?: string;
  isSeen: boolean;
}

class ContactUs extends Model<ContactProps> {}

ContactUs.init(
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.BIGINT, allowNull: false },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [3, 200] },
    },
    description: { type: DataTypes.STRING, allowNull: false },
    isReplayed: { type: DataTypes.BOOLEAN, defaultValue: false },
    media: { type: DataTypes.STRING, allowNull: true },
    isSeen: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    modelName: "ContactUs",
    tableName: "contactus",
    timestamps: true,
  }
);

User.hasMany(ContactUs, { foreignKey: "userId" });

ContactUs.belongsTo(User, { foreignKey: "userId" });

export default ContactUs;
