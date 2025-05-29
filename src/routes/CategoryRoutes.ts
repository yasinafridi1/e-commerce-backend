import express from "express";
import auth from "../middlewares/Auth";
import roleAuthorization from "../middlewares/RoleAuthorization";
import { ROLES } from "../config/Constants";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getAllCategoriesWithDetail,
  getCategoryDetail,
  updateCategory,
} from "../controllers/CategoryController";
import { ValidateBody, validateParams } from "../middlewares/Validator";
import { categoryParams, categorySchema } from "../validations";

const router = express.Router();

router
  .route("/with/details")
  .get([auth, roleAuthorization([ROLES.admin])], getAllCategoriesWithDetail);

router
  .route("/")
  .get(getAllCategories)
  .post(
    [auth, roleAuthorization([ROLES.admin])],
    ValidateBody(categorySchema),
    addCategory
  );

router
  .route("/:categoryId")
  .get(
    [auth, roleAuthorization([ROLES.admin])],
    validateParams(categoryParams),
    getCategoryDetail
  )
  .patch(
    [auth, roleAuthorization([ROLES.admin])],
    validateParams(categoryParams),
    ValidateBody(categorySchema),
    updateCategory
  )
  .delete(
    [auth, roleAuthorization([ROLES.admin])],
    validateParams(categoryParams),
    deleteCategory
  );

export default router;
