import { CategoryProps } from "../../models/CategoryModel";
import Product from "../../models/ProductModel";

export const categoryBaseDto = ({ categoryId, title }: CategoryProps) => ({
  categoryId,
  title,
});

export const catgeoryDtoWithProductAndOrder = async ({
  categoryId,
  title,
}: CategoryProps) => {
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
