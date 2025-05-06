import express from "express";
import AdminRoutes from "./AdminRoutes";
import CategoryRoutes from "./CategoryRoutes";
import ProductRoutes from "./ProductRoutes";
const router = express.Router();

router.use("/admin", AdminRoutes);
router.use("/category", CategoryRoutes);
router.use("/products", ProductRoutes);

export default router;
