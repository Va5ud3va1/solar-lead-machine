import { Router } from "express";

import {
  addNote,
  getNotes,
} from "../controllers/note.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// Add note to a lead
router.post(
  "/:leadId/notes",
  authenticate,
  authorize("ADMIN", "SALES", "INSTALLER"),
  addNote
);

// Get notes for a lead
router.get(
  "/:leadId/notes",
  authenticate,
  authorize("ADMIN", "SALES", "INSTALLER"),
  getNotes
);

export default router;
