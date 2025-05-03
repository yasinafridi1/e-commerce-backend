import { adminLogin } from "../controllers/AdminController";
import express from "express";
const router = express.Router();

router.route("/login").post(adminLogin);

export default router;
