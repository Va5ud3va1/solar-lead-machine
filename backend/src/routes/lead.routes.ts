import { Router } from "express";
import { getLeads, getLead, createLead, updateLead, deleteLead, assignLead, updateLeadStatus } from "../controllers/lead.controller";

const router = Router();

router.get("/", getLeads);
router.get("/:id", getLead);
router.post("/", createLead);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);
router.put("/:id/assign", assignLead);
router.put("/:id/status", updateLeadStatus);

export default router;
