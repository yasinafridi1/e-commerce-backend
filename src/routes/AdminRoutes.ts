import {
  adminLogin,
  deleteCustomer,
  getAdminProfile,
  getAllCustomers,
  getCustomerDetail,
  updateCustomerStatus,
  updateProfile,
} from "../controllers/AdminController";
import express from "express";
import auth from "../middlewares/Auth";
import roleAuthorization from "../middlewares/RoleAuthorization";
import { ROLES } from "../config/Constants";
import { ValidateBody, validateParams } from "../middlewares/Validator";
import { idParamsSchema, loginSchema } from "../validations/commonSchema";
import { updateUserStatus } from "../validations";
const router = express.Router();

router.route("/login").post(ValidateBody(loginSchema), adminLogin);

router
  .route("/")
  .get([auth, roleAuthorization([ROLES.admin])], getAdminProfile)
  .patch([auth, roleAuthorization([ROLES.admin])], updateProfile);

router
  .route("/customer")
  .get([auth, roleAuthorization([ROLES.admin])], getAllCustomers);
router
  .route("/customer/:userId")
  .get(
    [auth, roleAuthorization([ROLES.admin])],
    validateParams(idParamsSchema),
    getCustomerDetail
  )
  .patch(
    [auth, roleAuthorization([ROLES.admin])],
    validateParams(idParamsSchema),
    ValidateBody(updateUserStatus),
    updateCustomerStatus
  )
  .delete(
    [auth, roleAuthorization([ROLES.admin])],
    validateParams(idParamsSchema),
    deleteCustomer
  );

export default router;
