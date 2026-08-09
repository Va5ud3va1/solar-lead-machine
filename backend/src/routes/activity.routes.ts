import { Router } from "express";
import { getLeadActivities, createActivity, createLeadNote, getLeadNotes } from "../controllers/activity.controller";

const router = Router();

router.get("/:leadId", getLeadActivities);
router.post("/:leadId", createActivity);
router.get("/:leadId/notes", getLeadNotes);
router.post("/:leadId/notes", createLeadNote);

export default router;
