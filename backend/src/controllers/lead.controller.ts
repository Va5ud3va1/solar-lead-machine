import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { getParam } from "../utils/params";

export async function getLeads(req: Request, res: Response) {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        _count: { select: { notes: true, activities: true, quotations: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leads" });
  }
}

export async function getLead(req: Request, res: Response) {
  try {
    const id = getParam(req.params.id);
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        notes: { orderBy: { createdAt: "desc" } },
        activities: { orderBy: { createdAt: "desc" } },
        quotations: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lead" });
  }
}

export async function createLead(req: Request, res: Response) {
  try {
    const { customer, email, phone, city, assignedToId } = req.body;
    const lead = await prisma.lead.create({
      data: { customer, email, phone, city, assignedToId },
    });
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: "Failed to create lead" });
  }
}

export async function updateLead(req: Request, res: Response) {
  try {
    const id = getParam(req.params.id);
    const data = req.body;
    const lead = await prisma.lead.update({
      where: { id },
      data,
    });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: "Failed to update lead" });
  }
}

export async function deleteLead(req: Request, res: Response) {
  try {
    const id = getParam(req.params.id);
    await prisma.lead.delete({ where: { id } });
    res.json({ message: "Lead deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete lead" });
  }
}

export async function assignLead(req: Request, res: Response) {
  try {
    const id = getParam(req.params.id);
    const { assignedToId } = req.body;
    const lead = await prisma.lead.update({
      where: { id },
      data: { assignedToId },
    });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: "Failed to assign lead" });
  }
}

export async function updateLeadStatus(req: Request, res: Response) {
  try {
    const id = getParam(req.params.id);
    const { status } = req.body;
    const lead = await prisma.lead.update({
      where: { id },
      data: { status },
    });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
}
