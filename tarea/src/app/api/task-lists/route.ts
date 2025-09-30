import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createTaskListSchema } from '@/lib/validations'
import { z } from 'zod'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const taskLists = await prisma.taskList.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        tasks: {
          orderBy: [
            { completed: 'asc' },
            { position: 'asc' },
            { createdAt: 'desc' },
          ],
        },
      },
      orderBy: { position: 'asc' },
    })

    return NextResponse.json({ taskLists })
  } catch (error) {
    console.error('Get task lists error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    const { name, color } = createTaskListSchema.parse(body)

    const lastTaskList = await prisma.taskList.findFirst({
      where: { userId: session.user.id },
      orderBy: { position: 'desc' },
    })

    const position = (lastTaskList?.position ?? 0) + 1

    const taskList = await prisma.taskList.create({
      data: {
        name,
        color,
        position,
        userId: session.user.id,
      },
      include: {
        tasks: true,
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

    console.error('Create task list error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}