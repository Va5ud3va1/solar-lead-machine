import { Request, Response } from "express";
import { prisma } from "../generated/prisma";
import { getParam } from "../utils/params";

export async function createNote(req: Request, res: Response) {
  try {
    const leadId = getParam(req.params.leadId);
    const { content } = req.body;
    const userId = (req as any).user?.id || "system"; // fallback if no auth middleware
    
    const note = await prisma.leadNote.create({
      data: { leadId, content, userId },
    });
    
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: "Failed to create note" });
  }
}

export async function getNotes(req: Request, res: Response) {
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
