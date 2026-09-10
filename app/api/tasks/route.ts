/**
 * @swagger
 * /api/tasks:
 *   get:
 *     tags:
 *      - Task APIs
 *     summary: Get all tasks
 *     responses:
 *       200:
 *         description: Successfully fetched tasks list
 *   post:
 *     summary: Create a new task
 *     responses:
 *       201:
 *         description: Task created successfully
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/auditLog';
import { emailEmitter } from '@/lib/emailEmitter';

// 1. All Tasks Get Karne Ke Liye (GET)
export async function GET() {
  try {
    const tasks = await prisma.task.findMany();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Tasks fetch nahi ho sake' }, { status: 500 });
  }
}

// 2. Naya Task Add Karne Ke Liye (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, priority, assignee, assigneeEmail } = body;

    // Basic Validation
    if (!title || !assignee) {
      return NextResponse.json(
        { error: 'Title aur Assignee likhna zaroori hai' },
        { status: 400 }
      );
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description: description || null,
        ...(priority && { priority }),
        assignee,
      },
    });

    // Audit Log Record
    await createAuditLog(
      'TASK_CREATED',
      `New task "${newTask.title}" assigned to ${newTask.assignee}`
    );

    // Async Email Trigger (Background Flow - Non Blocking)
    if (assigneeEmail) {
      emailEmitter.emit('sendTaskEmail', {
        to: assigneeEmail,
        taskTitle: newTask.title,
        userName: newTask.assignee,
      });
    }

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Task create nahi ho saka' }, { status: 500 });
  }
}