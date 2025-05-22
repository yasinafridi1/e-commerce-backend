import express from "express";
import { autoLogin } from "../controllers/AuthController";
import { ValidateBody } from "../middlewares/Validator";
import { refreshSessionSchema } from "../validations";
const router = express.Router();

router.post("/refresh", ValidateBody(refreshSessionSchema), autoLogin);

export default router;
