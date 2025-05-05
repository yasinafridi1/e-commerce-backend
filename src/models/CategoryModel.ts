import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConnect";

export interface CategoryProps {
  categoryId?: number;
  title: string;
}

// 2. Optional fields during creation
interface CategoryCreationAttributes
  extends Optional<CategoryProps, "categoryId"> {}

// 3. Define the Model
class Category extends Model<CategoryProps, CategoryCreationAttributes> {}

// 4. Initialize the model
Category.init(
  {
    categoryId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value: string) {
        this.setDataValue("title", value.toLowerCase());
      },
    },
  },
  {
    sequelize, // Sequelize instance
    modelName: "Category",
    tableName: "categories", // optional table name
    timestamps: true,
    paranoid: true, // 👈 Enables soft delete
  }
);

export default Category;
