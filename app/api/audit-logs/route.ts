/**
 * @swagger
 * /api/audit-logs:
 *   get:
 *     tags:
 *       - Audit Logs API
 *     summary: Get all audit logs
 *     description: Retrieve system action logs with pagination and filters
 *     responses:
 *       200:
 *         description: Audit logs fetched successfully
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error('GET Audit Logs Error:', error);
    return NextResponse.json({ error: 'Logs fetch nahi ho sake' }, { status: 500 });
  }
}