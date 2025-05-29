import Product from "../../models/ProductModel";
import { CategoryData } from "../../types";

export const categoryBaseDto = ({ categoryId, title }: CategoryData) => ({
  categoryId,
  title,
});

export const catgeoryDtoWithProductAndOrder = async ({
  categoryId,
  title,
}: CategoryData) => {
  try {
    const productCounts = await Product.count({ where: { categoryId } });
    return {
      categoryId,
      title,
      productCounts: productCounts || 0,
    };
  } catch (error) {
    throw error;
  }
};
