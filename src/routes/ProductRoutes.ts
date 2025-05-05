import express from "express";
import auth from "../middlewares/Auth";
import roleAuthorization from "../middlewares/RoleAuthorization";
import { ROLES } from "../config/Constants";

import { ValidateBody, validateParams } from "../middlewares/Validator";
import {
  addProduct,
  allProducts,
  deleteProduct,
  productDetail,
  updateProduct,
} from "../controllers/ProductController";
import { postProductSchema, productParams } from "../validations";

const router = express.Router();

router
  .route("/")
  .get(auth, allProducts)
  .post(
    [auth, roleAuthorization([ROLES.admin])],
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

export default router;
