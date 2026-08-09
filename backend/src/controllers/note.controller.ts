import { Request, Response } from "express";
import {
  createLeadNote,
  getLeadNotes,
} from "../services/note.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ActivityType } from "../types/activity";
import { createActivity } from "../services/activity.service";

// POST /api/leads/:leadId/notes
export const addNote = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { leadId } = req.params;
    const { content } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    if (!content || content.trim().length === 0) {
      res.status(400).json({
        message: "Note content is required",
      });
      return;
    }

    const note = await createLeadNote(
      leadId,
      userId,
      content.trim()
    );

    await createActivity(
      ActivityType.NOTE_ADDED,
      `Note added: ${content.trim()}`,
      leadId,
      userId
    );

    res.status(201).json(note);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create note",
    });
  }
};

// GET /api/leads/:leadId/notes
export const getNotes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { leadId } = req.params;

    const notes = await getLeadNotes(leadId);

    res.status(200).json(notes);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch notes",
    });
  }
};
