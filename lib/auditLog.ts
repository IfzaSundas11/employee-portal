import { prisma } from "@/lib/prisma";

export async function createAuditLog(action: string, details?: string, userId?: string)  {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        details,
        userId,
      },
    });
  } catch (error) {
    console.error("Audit log failed to save:", error);
  }
}