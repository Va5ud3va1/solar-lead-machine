import { Response } from "express";
import { QuotationStatus } from "@prisma/client";

import {
  createQuotation,
  getLeadQuotations,
  updateQuotationStatus,
} from "../services/quotation.service";

import { AuthRequest } from "../middlewares/auth.middleware";


// POST /api/leads/:leadId/quotations
export const createQuotationController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { leadId } = req.params;
    const { systemSize, amount, validUntil } = req.body;

    if (!systemSize || !amount) {
      res.status(400).json({
        message: "System size and amount are required",
      });
      return;
    }

    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        message: "User not authenticated",
      });
      return;
    }

    const quotation = await createQuotation(
      leadId,
      Number(systemSize),
      Number(amount),
      validUntil ? new Date(validUntil) : undefined,
      userId
    );

    res.status(201).json(quotation);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create quotation",
    });
  }
};


// GET /api/leads/:leadId/quotations
export const getQuotations = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { leadId } = req.params;

    const quotations = await getLeadQuotations(leadId);

    res.status(200).json(quotations);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch quotations",
    });
  }
};


// PATCH /api/quotations/:id/status
export const updateQuotationStatusController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({
        message: "Quotation status is required",
      });
      return;
    }

    const validStatuses = Object.values(QuotationStatus);

    if (!validStatuses.includes(status)) {
      res.status(400).json({
        message: "Invalid quotation status",
        allowedStatuses: validStatuses,
      });
      return;
    }

    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        message: "User not authenticated",
      });
      return;
    }

    const quotation = await updateQuotationStatus(
      id,
      status,
      userId
    );

    res.status(200).json(quotation);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update quotation status",
    });
  }
};