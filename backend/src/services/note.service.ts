import { prisma } from "../generated/prisma";

export const createLeadNote = async (
  leadId: string,
  userId: string,
  content: string
) => {
  return prisma.leadNote.create({
    data: {
      content,
      leadId,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

export const getLeadNotes = async (leadId: string) => {
  return prisma.leadNote.findMany({
    where: {
      leadId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};