import { Router } from "express";
import {
  register,
  login,
  profile,
} from "../controllers/auth.controller";

import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/profile", authenticate, profile);

export default router;