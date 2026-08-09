import prisma from "../prisma/client";

import {
  ActivityType,
  QuotationStatus,
} from "@prisma/client";

import { createActivity } from "./activity.service";


// Create quotation
export const createQuotation = async (
  leadId: string,
  systemSize: number,
  amount: number,
  validUntil: Date | undefined,
  userId: string
) => {
  const quotation = await prisma.quotation.create({
    data: {
      leadId,
      systemSize,
      amount,
      validUntil,
    },
  });

  await createActivity(
    ActivityType.QUOTATION_CREATED,
    `Quotation created: ${systemSize}kW system for ₹${amount}`,
    leadId,
    userId
  );

  return quotation;
};


// Get quotations for a lead
export const getLeadQuotations = async (
  leadId: string
) => {
  return prisma.quotation.findMany({
    where: {
      leadId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


// Update quotation status
export const updateQuotationStatus = async (
  quotationId: string,
  status: QuotationStatus,
  userId: string
) => {
  const oldQuotation =
    await prisma.quotation.findUnique({
      where: {
        id: quotationId,
      },
    });

  if (!oldQuotation) {
    throw new Error("Quotation not found");
  }

  const quotation =
    await prisma.quotation.update({
      where: {
        id: quotationId,
      },
      data: {
        status,
      },
    });

  await createActivity(
    ActivityType.QUOTATION_STATUS_CHANGED,
    `Quotation status changed from ${oldQuotation.status} to ${status}`,
    quotation.leadId,
    userId
  );

  // Automatically mark lead as WON
  // when quotation is accepted
  if (status === QuotationStatus.ACCEPTED) {
    await prisma.lead.update({
      where: {
        id: quotation.leadId,
      },
      data: {
        status: "WON",
      },
    });
  }

  return quotation;
};
