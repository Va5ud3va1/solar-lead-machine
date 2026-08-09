import { prisma } from "../prisma/client";
import { ActivityType } from "../types/activity";

export const createActivity = async (
type: string,
message: string,
leadId: string,
userId: string
) => {
return prisma.leadActivity.create({
data: {
type,
details: message,
leadId,
userId,
},
});
};

export const getLeadActivities = async (
leadId: string
) => {
return prisma.leadActivity.findMany({
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
