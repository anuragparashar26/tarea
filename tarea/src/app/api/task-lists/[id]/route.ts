import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateTaskListSchema } from '@/lib/validations'
import { z } from 'zod'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const updateData = updateTaskListSchema.parse(body)

    const existingTaskList = await prisma.taskList.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingTaskList) {
      return NextResponse.json(
        { error: 'Task list not found' },
        { status: 404 }
      )
    }

    const taskList = await prisma.taskList.update({
      where: { id },
      data: updateData,
      include: {
        tasks: {
          orderBy: [
            { completed: 'asc' },
            { position: 'asc' },
            { createdAt: 'desc' },
          ],
        },
      },
    })

    return NextResponse.json({ taskList })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Update task list error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const existingTaskList = await prisma.taskList.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingTaskList) {
      return NextResponse.json(
        { error: 'Task list not found' },
        { status: 404 }
      )
    }

    await prisma.taskList.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Task list deleted successfully' })
  } catch (error) {
    console.error('Delete task list error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}