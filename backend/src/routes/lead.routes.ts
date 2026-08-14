import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { getLeads, getLead, createLead, updateLead, deleteLead, assignLead, updateLeadStatus } from "../controllers/lead.controller";

const router = Router();

router.get("/", authenticate, getLeads);
router.get("/:id", authenticate, getLead);
router.post("/", authenticate, createLead);
router.put("/:id", authenticate, updateLead);
router.delete("/:id", authenticate, deleteLead);
router.put("/:id/assign", authenticate, assignLead);
router.put("/:id/status", authenticate, updateLeadStatus);

export default router;
