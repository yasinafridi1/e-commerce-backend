import express from "express";
import auth from "../middlewares/Auth";
import roleAuthorization from "../middlewares/RoleAuthorization";
import { ROLES } from "../config/Constants";

import { ValidateBody, validateParams } from "../middlewares/Validator";
import {
  addProduct,
  allProductsAdmin,
  allProductsPublic,
  deleteProduct,
  productDetail,
  updateProduct,
} from "../controllers/ProductController";
import { postProductSchema, productParams } from "../validations";
import upload from "../utils/multer";

const router = express.Router();

router
  .route("/")
  .get(allProductsPublic)
  .post(
    [auth, roleAuthorization([ROLES.admin])],
    upload.any(),
    ValidateBody(postProductSchema),
    addProduct
  );

router
  .route("/:productId")
  .get(
    [auth, roleAuthorization([ROLES.admin])],
    validateParams(productParams),
    productDetail
  )
  .patch(
    [auth, roleAuthorization([ROLES.admin])],
    validateParams(productParams),
    ValidateBody(postProductSchema),
    updateProduct
  )
  .delete(
    [auth, roleAuthorization([ROLES.admin])],
    validateParams(productParams),
    deleteProduct
  );

router
  .route("/admin")
  .get([auth, roleAuthorization([ROLES.admin])], allProductsAdmin);

export default router;
