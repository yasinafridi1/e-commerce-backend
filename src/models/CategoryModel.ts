import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConnect";

export interface CatgeoryProps {
  categoryId?: number;
  title: string;
}

// 2. Optional fields during creation
interface CategoryCreationAttributes
  extends Optional<CatgeoryProps, "categoryId"> {}

// 3. Define the Model
class Category extends Model<CatgeoryProps, CategoryCreationAttributes> {}

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
    },
  },
  {
    sequelize, // Sequelize instance
    modelName: "Category",
    tableName: "categories", // optional table name
    timestamps: true,
  }
);

export default Category;
