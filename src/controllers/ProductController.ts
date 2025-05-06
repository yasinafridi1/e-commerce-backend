import { NextFunction, Request, Response } from "express";
import AsyncWrapper from "../utils/AsyncWrapper";
import ErrorHandler from "../utils/ErrorHandler";
import SuccessMessage from "../utils/SuccessMessage";
import { Op } from "sequelize";
import Product from "../models/ProductModel";
import Category from "../models/CategoryModel";

export const allProductsPublic = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      page = 1,
      limit = 20,
      search = "",
      categoryId,
      productType,
    }: {
      page?: number;
      limit?: number;
      search?: string;
      categoryId?: number | null | undefined;
      productType?: string;
    } = req.query;

    const whereClause: any = {
      status: "SHOW",
    };

    // Search by product name
    if (search) {
      whereClause.productName = { [Op.iLike]: `%${search.toLowerCase()}%` };
    }

    // Filter by category
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    // Filter by product type
    if (productType) {
      whereClause.productType = productType.toUpperCase();
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { rows: products, count: totalProducts } =
      await Product.findAndCountAll({
        where: whereClause,
        limit: Number(limit),
        offset,
        include: [{ model: Category, attributes: ["categoryId", "title"] }],
        order: [["createdAt", "DESC"]],
      });

    const totalPages = Math.ceil(totalProducts / Number(limit));

    return SuccessMessage(res, "Products fetched successfully", {
      products,
      totalProducts,
      currentPage: Number(page),
      totalPages,
    });
  }
);

export const allProductsAdmin = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      page = 1,
      limit = 20,
      search = "",
      categoryId,
      productType,
      status = "SHOW",
    }: {
      page?: number;
      limit?: number;
      search?: string;
      categoryId?: number | null | undefined;
      productType?: string;
      status?: string;
    } = req.query;

    const whereClause: any = {
      status,
    };

    // Search by product name
    if (search) {
      whereClause.productName = { [Op.iLike]: `%${search.toLowerCase()}%` };
    }

    // Filter by category
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    // Filter by product type
    if (productType) {
      whereClause.productType = productType.toUpperCase();
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { rows: products, count: totalProducts } =
      await Product.findAndCountAll({
        where: whereClause,
        limit: Number(limit),
        offset,
        include: [{ model: Category, attributes: ["categoryId", "title"] }],
        order: [["createdAt", "DESC"]],
      });

    const totalPages = Math.ceil(totalProducts / Number(limit));

    return SuccessMessage(res, "Products fetched successfully", {
      products,
      totalProducts,
      currentPage: Number(page),
      totalPages,
    });
  }
);

export const addProduct = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productName, variants, categoryId, price, productType, status } =
      req.body;

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return next(new ErrorHandler("Category not found", 400));
    }

    const files = req.files as Express.Multer.File[]; // multer puts files here

    // Parse variants (make sure frontend sends it as JSON string)
    const parsedVariants = JSON.parse(variants);

    //loop and assign image from files
    for (let variant of parsedVariants) {
      for (let size of variant.sizes) {
        const matchedFile = (files as Express.Multer.File[])?.find((f) => {
          return f.fieldname === `${variant.color}-${size.label}`;
        });
        if (matchedFile) {
          size.image = `${matchedFile.filename}`;
        }
      }
    }

    // const product = await Product.create({
    //   productName,
    //   categoryId,
    //   price,
    //   status,
    //   productType,
    //   variants: parsedVariants,
    // });

    return SuccessMessage(res, "Product added successfully");
  }
);

export const deleteProduct = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;

    const deletedCount = await Product.destroy({ where: { productId } });

    if (deletedCount === 0) {
      return next(new ErrorHandler("Product not found", 400));
    }

    return SuccessMessage(res, "Product deleted successfully");
  }
);

export const productDetail = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findByPk(req.params.productid);
    if (!product) {
      return next(new ErrorHandler("Product not found", 400));
    }
    return SuccessMessage(res, "Product detail fetched successfully", product);
  }
);

export const updateProduct = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {}
);
