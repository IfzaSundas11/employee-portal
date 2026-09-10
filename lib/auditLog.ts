import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createAuditLog(action: string, details?: string, userId?: string) {
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