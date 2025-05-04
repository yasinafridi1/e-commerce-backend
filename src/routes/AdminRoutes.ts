import {
  adminLogin,
  getAdminProfile,
  updateProfile,
} from "../controllers/AdminController";
import express from "express";
import auth from "../middlewares/Auth";
import roleAuthorization from "../middlewares/RoleAuthorization";
import { ROLES } from "../config/Constants";
import { ValidateBody } from "../middlewares/Validator";
import { loginSchema } from "../validations/commonSchema";
const router = express.Router();

router.route("/login").post(ValidateBody(loginSchema), adminLogin);

router
  .route("/")
  .get([auth, roleAuthorization([ROLES.admin])], getAdminProfile)
  .patch([auth, roleAuthorization([ROLES.admin])], updateProfile);

export default router;
