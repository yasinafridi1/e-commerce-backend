import { NextFunction, Request, Response } from "express";
import AsyncWrapper from "../utils/AsyncWrapper";
import ErrorHandler from "../utils/ErrorHandler";
import SuccessMessage from "../utils/SuccessMessage";
import { Op } from "sequelize";
import Product from "../models/ProductModel";

export const allProducts = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {}
);
export const addProduct = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {}
);
export const updateProduct = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {}
);
export const deleteProduct = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const productDetail = AsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {}
);
