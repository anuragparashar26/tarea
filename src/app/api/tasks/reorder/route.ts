import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { reorderTasksSchema } from '@/lib/validations'
import { z } from 'zod'

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { tasks } = reorderTasksSchema.parse(body)

    const taskIds = tasks.map(t => t.id)
    const userTasks = await prisma.task.findMany({
      where: {
        id: { in: taskIds },
        taskList: {
          userId: session.user.id,
        },
      },
    })

    if (userTasks.length !== taskIds.length) {
      return NextResponse.json(
        { error: 'Some tasks not found or unauthorized' },
        { status: 403 }
      )
    }

    await prisma.$transaction(
      tasks.map(({ id, position }) =>
        prisma.task.update({
          where: { id },
          data: { position },
        })
      )
    )

    return NextResponse.json({ message: 'Tasks reordered successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Reorder tasks error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}