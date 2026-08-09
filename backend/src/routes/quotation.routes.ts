import { Router } from "express";
import { createQuotation, getLeadQuotations, updateQuotation } from "../controllers/quotation.controller";

const router = Router();

router.post("/:leadId", createQuotation);
router.get("/:leadId", getLeadQuotations);
router.put("/:id", updateQuotation);

export default router;
