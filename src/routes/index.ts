import express from "express";
import AdminRoutes from "./AdminRoutes";
import CategoryRoutes from "./CategoryRoutes";

const router = express.Router();

router.use("/admin", AdminRoutes);
router.use("/category", CategoryRoutes);

export default router;
