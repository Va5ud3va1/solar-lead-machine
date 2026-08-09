import { prisma } from "../prisma/client";

export async function createQuotation(data: {
  quotationNo: string;
  leadId: string;
  amount: number;
  validity: Date;
  status?: string;
  userId: string;
}) {
  return prisma.quotation.create({ data });
}

export async function getLeadQuotations(leadId: string) {
  return prisma.quotation.findMany({
    where: { leadId },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateQuotation(id: string, data: any) {
  return prisma.quotation.update({ where: { id }, data });
}
