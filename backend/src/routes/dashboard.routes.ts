import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "SALES", "INSTALLER"),
  getDashboard
);

export default router;
