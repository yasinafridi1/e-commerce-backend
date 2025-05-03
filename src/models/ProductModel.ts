import { DataTypes, Model, Optional } from "sequelize";
import { PRODUCT_TYPE } from "../config/Constants";
import { sequelize } from "../config/dbConnect";
import Category from "./CategoryModel";

// 1. ProductType type
type ProductType = (typeof PRODUCT_TYPE)[keyof typeof PRODUCT_TYPE];

// 2. Interface for attributes
interface ProductAttributes {
  productId?: number;
  categoryId: number;
  price: number;
  availableStock: number;
  productType: ProductType;
  status: "SHOW" | "HIDE";
  colors: { code: string }[];
  images: { url: string }[];
}

// 3. Creation attributes
interface ProductCreationAttributes
  extends Optional<ProductAttributes, "productId"> {}

// 4. Sequelize Model
class Product extends Model<ProductAttributes, ProductCreationAttributes> {}

// 5. Init model
Product.init(
  {
    productId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    availableStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productType: {
      type: DataTypes.ENUM(...Object.values(PRODUCT_TYPE)),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("SHOW", "HIDE"),
      allowNull: false,
    },
    colors: {
      type: DataTypes.JSON, // use JSONB for PostgreSQL, or JSON for MySQL
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
  }
);

Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, {
  foreignKey: "categoryId",
});

export default Product;
