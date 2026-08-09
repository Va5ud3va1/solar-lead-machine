import { Request, Response } from "express";
import { prisma } from "../generated/prisma";
import { getParam } from "../utils/params";

export async function createQuotation(req: Request, res: Response) {
  try {
    const leadId = getParam(req.params.leadId);
    const { quotationNo, amount, validity, status } = req.body;
    const userId = (req as any).user?.id || "system"; // fallback if no auth middleware
    
    const quotation = await prisma.quotation.create({
      data: { 
        quotationNo, 
        leadId, 
        amount: parseFloat(amount), 
        validity: new Date(validity), 
        status: status || "PENDING", 
        userId 
      },
    });
    
    res.status(201).json(quotation);
  } catch (error) {
    res.status(500).json({ error: "Failed to create quotation" });
  }
}

export async function getLeadQuotations(req: Request, res: Response) {
  try {
    const leadId = getParam(req.params.leadId);
    const quotations = await prisma.quotation.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
    });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quotations" });
  }
}

export async function updateQuotation(req: Request, res: Response) {
  try {
    const id = getParam(req.params.id);
    const data = req.body;
    
    const quotation = await prisma.quotation.update({
      where: { id },
      data,
    });
    
    res.json(quotation);
  } catch (error) {
    res.status(500).json({ error: "Failed to update quotation" });
  }
}
