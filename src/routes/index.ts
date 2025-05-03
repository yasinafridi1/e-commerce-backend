import express from "express";
import AdminRoutes from "./AdminRoutes";

const router = express.Router();

router.use("/admin", AdminRoutes);

export default router;
