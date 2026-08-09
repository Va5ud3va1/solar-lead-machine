import prisma from "../prisma/client";
import { LeadStatus } from "@prisma/client";

export const getDashboardStats = async () => {
  const totalLeads = await prisma.lead.count();

  const newLeads = await prisma.lead.count({
    where: {
      status: LeadStatus.NEW,
    },
  });

  const contacted = await prisma.lead.count({
    where: {
      status: LeadStatus.CONTACTED,
    },
  });

  const siteVisits = await prisma.lead.count({
    where: {
      status: LeadStatus.SITE_VISIT,
    },
  });

  const quotations = await prisma.lead.count({
    where: {
      status: LeadStatus.QUOTATION_SENT,
    },
  });

  const negotiations = await prisma.lead.count({
    where: {
      status: LeadStatus.NEGOTIATION,
    },
  });

  const won = await prisma.lead.count({
    where: {
      status: LeadStatus.WON,
    },
  });

  const lost = await prisma.lead.count({
    where: {
      status: LeadStatus.LOST,
    },
  });

  const conversionRate =
    totalLeads === 0 ? 0 : Number(((won / totalLeads) * 100).toFixed(2));

  return {
    totalLeads,
    newLeads,
    contacted,
    siteVisits,
    quotations,
    negotiations,
    won,
    lost,
    conversionRate,
  };
};