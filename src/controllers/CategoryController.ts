import { NextFunction, Request, Response } from "express";
import AsyncWrapper from "../utils/AsyncWrapper";
import ErrorHandler from "../utils/ErrorHandler";
import Category from "../models/CategoryModel";
import SuccessMessage from "../utils/SuccessMessage";
import { Op } from "sequelize";
import { CachedCategoryData, CategoryData, PaginationQuery } from "../types";
import {
  getFromCache,
  removeCache,
  setCategoryCache,
} from "../services/CacheService";
import { CACHE_KEYS } from "../config/Constants";
import { categoryBaseDto } from "../services/DTOs/CategoryDto";

export const getAllCategories = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    let data: CachedCategoryData[] | unknown = getFromCache(
      CACHE_KEYS.allCategories
    );
    if (!data) {
      const freshData: CategoryData[] | any = await Category.findAll();
      setCategoryCache(freshData);
      data = freshData.map((item: CategoryData) => categoryBaseDto(item));
    }
    return SuccessMessage(res, "All category fetched successfully", data);
  }
);

export const getAllCategoriesWithDetail = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, search }: PaginationQuery = req.query;
    let pageNumber = parseInt(page as string, 10);
    let limitNumber = parseInt(limit as string, 10);

    // Defaults: page=1, limit=10 if invalid
    pageNumber = isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber;
    limitNumber = isNaN(limitNumber) || limitNumber < 1 ? 10 : limitNumber;

    const offset = limitNumber * (pageNumber - 1);
    const where: any = {}; // Optional: Add filters if needed

    // Add search filter (if needed)
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } }, // Assuming 'name' is a field in Category
      ];
    }

    const categories = await Category.findAll({
      where,
      attributes: [
        "categoryId", // Adjust fields as per your model
        "title",
        "createdAt",
        "updatedAt",
      ],
      limit: limitNumber,
      offset,
      order: [["createdAt", "DESC"]], // Sort by newest first
    });

    const totalCategories = await Category.count({ where });
    const totalPages = Math.ceil(totalCategories / limitNumber);

    return SuccessMessage(res, "Categories fetched successfully", {
      categories,
      totalRecords: totalCategories,
      totalPages,
      currentPage: pageNumber,
      limit: limitNumber,
    });
  }
);

export const addCategory = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body;

    const isExisting = await Category.findOne({
      where: { title: title.toLowerCase() },
      paranoid: false, // Ensure we check even soft-deleted records
    });
    if (isExisting) {
      return next(
        new ErrorHandler("Category already exist or may have soft deleted", 409)
      );
    }

    const newCategory: CategoryData | any = await Category.create({ title });
    removeCache(CACHE_KEYS.allCategories);
    return SuccessMessage(
      res,
      "Category added successfully",
      categoryBaseDto(newCategory)
    );
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
      paranoid: false, // Ensure we check even soft-deleted records
    });

    if (isExisting) {
      return next(new ErrorHandler("Category already exist", 409));
    }

    await Category.update({ title }, { where: { categoryId } });

    const category = await Category.findByPk(categoryId, {
      attributes: { exclude: ["deletedAt"] },
    });
    removeCache(CACHE_KEYS.allCategories);

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
    removeCache(CACHE_KEYS.allCategories);

    return SuccessMessage(res, "Category deleted successfully", {
      categoryId: Number(categoryId),
    });
  }
);
