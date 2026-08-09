import { Router } from "express";
import {
  getAllLeads,
  createLead,
  getLeadById,
  updateLeadStatus,
  assignLead,
  getMyLeads,
  updateLead,
  deleteLead,
} from "../controllers/lead.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// PUBLIC: Anyone can submit a lead (website form)
router.post(
  "/",
  createLead
);

// All logged-in users can view all leads
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "SALES", "INSTALLER"),
  getAllLeads
);

// My assigned leads
router.get(
  "/my",
  authenticate,
  authorize("ADMIN", "SALES", "INSTALLER"),
  getMyLeads
);

// All logged-in users can view a single lead
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "SALES", "INSTALLER"),
  getLeadById
);

// Update lead status (requires auth)
router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN", "SALES"),
  updateLeadStatus
);

// Update lead (requires auth)
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN", "SALES"),
  updateLead
);

// Delete lead (ADMIN only)
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteLead
);

// Assign lead (ADMIN only)
router.patch(
  "/:id/assign",
  authenticate,
  authorize("ADMIN"),
  assignLead
);

export default router;
