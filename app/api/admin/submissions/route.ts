import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const unreadOnly = searchParams.get('unread') === 'true'

    // Get submissions
    let submissions
    if (unreadOnly) {
      submissions = await sql`
        SELECT id, name, email, message, created_at, read
        FROM contact_submissions
        WHERE read = false
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `
    } else {
      submissions = await sql`
        SELECT id, name, email, message, created_at, read
        FROM contact_submissions
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `
    }

    // Get total count
    const totalResult = await sql`
      SELECT COUNT(*) as count FROM contact_submissions
    `
    const total = parseInt(totalResult[0]?.count?.toString() || '0')

    // Get unread count
    const unreadResult = await sql`
      SELECT COUNT(*) as count FROM contact_submissions WHERE read = false
    `
    const unread = parseInt(unreadResult[0]?.count?.toString() || '0')

    return NextResponse.json({
      submissions,
      total,
      unread,
    })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { id, read } = body

    if (typeof id !== 'number' || typeof read !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    await sql`
      UPDATE contact_submissions
      SET read = ${read}
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating submission:', error)
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    )
  }
}

