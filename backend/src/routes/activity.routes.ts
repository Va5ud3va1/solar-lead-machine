import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { getLeadActivities, createActivity, createLeadNote, getLeadNotes } from "../controllers/activity.controller";

const router = Router();

router.use(authenticate);

router.get("/:leadId", getLeadActivities);
router.post("/:leadId", createActivity);
router.get("/:leadId/notes", getLeadNotes);
router.post("/:leadId/notes", createLeadNote);

export default router;
