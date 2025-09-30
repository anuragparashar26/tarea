import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateTaskSchema } from '@/lib/validations'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

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
    const updateData = updateTaskSchema.parse(body)

    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        taskList: {
          userId: session.user.id,
        },
      },
      include: {
        taskList: true,
      },
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    if (updateData.taskListId && updateData.taskListId !== existingTask.taskListId) {
      const newTaskList = await prisma.taskList.findFirst({
        where: {
          id: updateData.taskListId,
          userId: session.user.id,
        },
      })

      if (!newTaskList) {
        return NextResponse.json(
          { error: 'Target task list not found' },
          { status: 404 }
        )
      }
    }

  const processedData: Prisma.TaskUpdateInput = { ...updateData }
    if (updateData.dueDate !== undefined) {
      processedData.dueDate = updateData.dueDate ? new Date(updateData.dueDate) : null
    }
    if (updateData.reminder !== undefined) {
      processedData.reminder = updateData.reminder ? new Date(updateData.reminder) : null
    }

    if (updateData.completed !== undefined) {
      processedData.completedAt = updateData.completed ? new Date() : null
    }

    const task = await prisma.task.update({
      where: { id },
      data: processedData,
      include: {
        taskList: true,
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

    console.error('Update task error:', error)
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

    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        taskList: {
          userId: session.user.id,
        },
      },
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    await prisma.task.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Delete task error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}