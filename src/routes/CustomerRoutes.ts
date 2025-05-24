import express from "express";
import {
  customerLogin,
  getCustomerProfile,
  registerCustomer,
  updateCustomerProfile,
} from "../controllers/UserController";
import { ValidateBody } from "../middlewares/Validator";
import { loginSchema } from "../validations/commonSchema";
import { registerUserSchema } from "../validations";
const router = express.Router();

router.route("/login").post(ValidateBody(loginSchema), customerLogin);
router
  .route("/register")
  .post(ValidateBody(registerUserSchema), registerCustomer);
router.route("/").get(getCustomerProfile).patch(updateCustomerProfile);

export default router;
