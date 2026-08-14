import { Request, Response } from "express";
import { prisma } from "../generated/prisma";
import { getParam } from "../utils/params";

export async function getLeads(req: Request, res: Response) {
  try {
    console.log("DEBUG: Getting leads...", req.query);
    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;
    const where: any = {};
    if (status && status !== "ALL") { where.status = status; }
    if (search && search.trim()) {
      const searchTerm = search.trim();
      where.OR = [
        { customer: { contains: searchTerm, mode: "insensitive" } },
        { phone: { contains: searchTerm, mode: "insensitive" } },
        { city: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
      ];
    }
    const leads = await prisma.lead.findMany({
      where,
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        _count: { select: { notes: true, activities: true, quotations: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    console.log("DEBUG: Found", leads.length, "leads");
    res.json(leads);
  } catch (error: any) {
    console.error("DEBUG ERROR:", error.message);
    console.error("DEBUG STACK:", error.stack);
    res.status(500).json({ error: "Failed to fetch leads", details: error.message });
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
  } catch (error: any) {
    console.error("DEBUG ERROR:", error.message);
    res.status(500).json({ error: "Failed to fetch lead", details: error.message });
  }
}

export async function createLead(req: Request, res: Response) {
  try {
    const { customer, email, phone, city, assignedToId } = req.body;
    const lead = await prisma.lead.create({
      data: { customer, email, phone, city, assignedToId },
    });
    res.status(201).json(lead);
  } catch (error: any) {
    console.error("DEBUG ERROR:", error.message);
    res.status(500).json({ error: "Failed to create lead", details: error.message });
  }
}

export async function updateLead(req: Request, res: Response) {
  try {
    const id = getParam(req.params.id);
    const data = req.body;
    const lead = await prisma.lead.update({ where: { id }, data });
    res.json(lead);
  } catch (error: any) {
    console.error("DEBUG ERROR:", error.message);
    res.status(500).json({ error: "Failed to update lead", details: error.message });
  }
}

export async function deleteLead(req: Request, res: Response) {
  try {
    const id = getParam(req.params.id);
    await prisma.lead.delete({ where: { id } });
    res.json({ message: "Lead deleted" });
  } catch (error: any) {
    console.error("DEBUG ERROR:", error.message);
    res.status(500).json({ error: "Failed to delete lead", details: error.message });
  }
}

export async function assignLead(req: Request, res: Response) {
  try {
    const id = getParam(req.params.id);
    const { assignedToId } = req.body;
    const lead = await prisma.lead.update({ where: { id }, data: { assignedToId } });
    res.json(lead);
  } catch (error: any) {
    console.error("DEBUG ERROR:", error.message);
    res.status(500).json({ error: "Failed to assign lead", details: error.message });
  }
}

export async function updateLeadStatus(req: Request, res: Response) {
  try {
    const id = getParam(req.params.id);
    const { status } = req.body;
    const currentLead = await prisma.lead.findUnique({ where: { id } });
    if (!currentLead) return res.status(404).json({ error: "Lead not found" });
    const oldStatus = currentLead.status;
    const lead = await prisma.lead.update({ where: { id }, data: { status } });
    // Create activity log (non-fatal - status update succeeds even if this fails)
    try {
      const userId = (req as any).user?.userId;
      await prisma.leadActivity.create({
        data: {
          type: "status_changed",
          details: `Status changed from ${oldStatus} to ${status}`,
          leadId: lead.id,
          userId: userId || "system",
        },
      });
    } catch (activityError: any) {
      console.error("Activity log failed (non-fatal):", activityError.message);
    }
    res.json(lead);
  } catch (error: any) {
    console.error("DEBUG ERROR:", error.message);
    res.status(500).json({ error: "Failed to update status", details: error.message });
  }
}
