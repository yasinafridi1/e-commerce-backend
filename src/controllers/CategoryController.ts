import { NextFunction, Request, Response } from "express";
import AsyncWrapper from "../utils/AsyncWrapper";
import ErrorHandler from "../utils/ErrorHandler";
import Category from "../models/CategoryModel";
import SuccessMessage from "../utils/SuccessMessage";
import { Op } from "sequelize";

export const getAllCategories = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await Category.findAll();
    return SuccessMessage(res, "All category fetched successfully", data);
  }
);

export const getAllCategoriesWithDetail = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await Category.findAll();
    return SuccessMessage(res, "All category fetched successfully", data);
  }
);

export const addCategory = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body;

    const isExisting = await Category.findOne({
      where: { title: title.toLowerCase() },
    });
    if (isExisting) {
      return next(new ErrorHandler("Category already exist", 409));
    }

    const newCategory = await Category.create({ title });

    return SuccessMessage(res, "Category added successfully", newCategory);
  }
);

export const updateCategory = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body;
    const { categoryId } = req.params;
    const isExisting = await Category.findOne({
      where: {
        title: title.toLowerCase(),
        categoryId: { [Op.ne]: categoryId }, // Not equal to the current ID
      },
    });

    if (isExisting) {
      return next(new ErrorHandler("Category already exist", 409));
    }

    await Category.update({ title }, { where: { categoryId } });

    const category = await Category.findAll({ where: { categoryId } });

    return SuccessMessage(res, "Category updated successfully", category);
  }
);

export const getCategoryDetail = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findByPk(req.params.categoryId);
    if (!category) {
      return next(new ErrorHandler("Category not found", 400));
    }

    return SuccessMessage(
      res,
      "Category detail fetched successfully",
      category
    );
  }
);

export const deleteCategory = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;

    const deleteCount = await Category.destroy({ where: { categoryId } });

    if (deleteCount === 0) {
      return next(new ErrorHandler("Category not found", 400));
    }

    return SuccessMessage(res, "Category deleted successfully");
  }
);
