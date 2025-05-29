import { DataTypes, Model, Optional } from "sequelize";
import { PRODUCT_TYPE } from "../config/Constants";
import { sequelize } from "../config/dbConnect";
import Category from "./CategoryModel";

// 1. ProductType type
type ProductType = (typeof PRODUCT_TYPE)[keyof typeof PRODUCT_TYPE];

// 2. Interface for attributes
export interface ProductAttributes {
  productId?: number;
  productName: string;
  categoryId: number;
  price: number;
  productType: ProductType;
  status: "SHOW" | "HIDE";
  availableStock?: number; // 👈 Add this line
  variants: {
    colorName: string;
    colorCode: string;
    sizes: {
      size: string;
      stock: number;
      image: string; // Single image per size
    }[];
  }[];
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
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [3, 250] },
    },
    categoryId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
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
    variants: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    availableStock: {
      type: DataTypes.VIRTUAL,
      get() {
        const variants = this.getDataValue("variants") || [];
        return variants.reduce((sum, variant) => {
          return (
            sum + (variant.sizes || []).reduce((s, size) => s + size.stock, 0)
          );
        }, 0);
      },
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
    paranoid: true, // 👈 Enables soft delete
  }
);

Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, {
  foreignKey: "categoryId",
});

export default Product;
