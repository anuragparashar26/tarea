import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { reorderNotesSchema } from '@/lib/validations'
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
    const { notes } = reorderNotesSchema.parse(body)

    // Update positions in a transaction
    await prisma.$transaction(
      notes.map(({ id, position }) =>
        prisma.note.updateMany({
          where: {
            id,
            userId: session.user.id,
          },
          data: { position },
        })
      )
    )

    return NextResponse.json({ message: 'Notes reordered successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Reorder notes error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}