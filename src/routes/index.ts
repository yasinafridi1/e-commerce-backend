import express from "express";
import AdminRoutes from "./AdminRoutes";
import CategoryRoutes from "./CategoryRoutes";
import ProductRoutes from "./ProductRoutes";
import AuthRoutes from "./AuthRoutes";
const router = express.Router();

router.use("/auth", AuthRoutes);
router.use("/admin", AdminRoutes);
router.use("/category", CategoryRoutes);
router.use("/products", ProductRoutes);

export default router;
