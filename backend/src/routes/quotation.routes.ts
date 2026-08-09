import { Router } from "express";

import {
  createQuotationController,
  getQuotations,
  updateQuotationStatusController,
} from "../controllers/quotation.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();


// Create quotation
router.post(
  "/leads/:leadId/quotations",
  authenticate,
  authorize("ADMIN", "SALES"),
  createQuotationController
);


// Get lead quotations
router.get(
  "/leads/:leadId/quotations",
  authenticate,
  authorize("ADMIN", "SALES", "INSTALLER"),
  getQuotations
);


// Update quotation status
router.patch(
  "/quotations/:id/status",
  authenticate,
  authorize("ADMIN", "SALES"),
  updateQuotationStatusController
);


export default router;
