import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createNoteSchema } from '@/lib/validations'
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

    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
        isArchived: false,
      },
      orderBy: [
        { isPinned: 'desc' },
        { position: 'asc' },
        { updatedAt: 'desc' },
      ],
    })

    return NextResponse.json({ notes })
  } catch (error) {
    console.error('Get notes error:', error)
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
    const { title, content, isPinned } = createNoteSchema.parse(body)

    const lastNote = await prisma.note.findFirst({
      where: { userId: session.user.id },
      orderBy: { position: 'desc' },
    })

    const position = (lastNote?.position ?? 0) + 1

    const note = await prisma.note.create({
      data: {
        title,
        content,
        isPinned,
        position,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ note })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Create note error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}