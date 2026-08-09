import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { getActivities, addNote, getNotes } from "../controllers/activity.controller";
const router = Router();
router.get("/:leadId/activities", authenticate, authorize("ADMIN","SALES"), getActivities);
router.get("/:leadId/notes", authenticate, authorize("ADMIN","SALES"), getNotes);
router.post("/:leadId/notes", authenticate, authorize("ADMIN","SALES"), addNote);
export default router;
