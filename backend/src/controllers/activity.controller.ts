import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { getParam } from "../utils/params";

export async function getLeadActivities(req: Request, res: Response) {
  try {
    const leadId = getParam(req.params.leadId);
    const activities = await prisma.leadActivity.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activities" });
  }
}

export async function createActivity(req: Request, res: Response) {
  try {
    const leadId = getParam(req.params.leadId);
    const { type, details } = req.body;
    const userId = (req as any).user?.id || "system"; // fallback if no auth middleware

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });
    
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    
    const activity = await prisma.leadActivity.create({
      data: {
        leadId,
        type,
        details,
        userId,
      },
    });
    
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: "Failed to create activity" });
  }
}

export async function getLeadNotes(req: Request, res: Response) {
  try {
    const leadId = getParam(req.params.leadId);
    const notes = await prisma.leadNote.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
}

export async function createLeadNote(req: Request, res: Response) {
  try {
    const leadId = getParam(req.params.leadId);
    const { content } = req.body;
    const userId = (req as any).user?.id || "system"; // fallback if no auth middleware
    
    const note = await prisma.leadNote.create({
      data: {
        leadId,
        content,
        userId,
      },
    });
    
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: "Failed to create note" });
  }
}
