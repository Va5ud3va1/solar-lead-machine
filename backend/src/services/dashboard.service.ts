import { prisma } from "../prisma/client";

export async function getDashboardStats() {
  const totalLeads = await prisma.lead.count();
  const newLeads = await prisma.lead.count({ where: { status: "NEW" } });
  const contactedLeads = await prisma.lead.count({ where: { status: "CONTACTED" } });
  const qualifiedLeads = await prisma.lead.count({ where: { status: "QUALIFIED" } });
  const wonLeads = await prisma.lead.count({ where: { status: "WON" } });
  const lostLeads = await prisma.lead.count({ where: { status: "LOST" } });
  const totalQuotations = await prisma.quotation.count();
  const totalActivities = await prisma.leadActivity.count();

  return {
    totalLeads,
    newLeads,
    contactedLeads,
    qualifiedLeads,
    wonLeads,
    lostLeads,
    totalQuotations,
    totalActivities,
  };
}
