import { Router } from "express";
import { createNote, getNotes } from "../controllers/note.controller";

const router = Router();

router.post("/:leadId", createNote);
router.get("/:leadId", getNotes);

export default router;
