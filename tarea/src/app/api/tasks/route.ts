import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createTaskSchema } from '@/lib/validations'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, dueDate, reminder, isMyDay, isImportant, taskListId } = createTaskSchema.parse(body)

    const taskList = await prisma.taskList.findFirst({
      where: {
        id: taskListId,
        userId: session.user.id,
      },
    })

    if (!taskList) {
      return NextResponse.json(
        { error: 'Task list not found' },
        { status: 404 }
      )
    }

    const lastTask = await prisma.task.findFirst({
      where: { taskListId },
      orderBy: { position: 'desc' },
    })

    const position = (lastTask?.position ?? 0) + 1

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        reminder: reminder ? new Date(reminder) : null,
        isMyDay,
        isImportant,
        position,
        taskListId,
      },
    })

    return NextResponse.json({ task })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Create task error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}