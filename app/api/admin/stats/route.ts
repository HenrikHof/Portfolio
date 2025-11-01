import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()

    // Get total submissions
    const totalResult = await sql`
      SELECT COUNT(*) as count FROM contact_submissions
    `
    const total = parseInt(totalResult[0]?.count?.toString() || '0')

    // Get unread submissions
    const unreadResult = await sql`
      SELECT COUNT(*) as count FROM contact_submissions WHERE read = false
    `
    const unread = parseInt(unreadResult[0]?.count?.toString() || '0')

    // Get submissions today
    const todayResult = await sql`
      SELECT COUNT(*) as count 
      FROM contact_submissions 
      WHERE DATE(created_at) = CURRENT_DATE
    `
    const today = parseInt(todayResult[0]?.count?.toString() || '0')

    // Get submissions this week
    const weekResult = await sql`
      SELECT COUNT(*) as count 
      FROM contact_submissions 
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
    `
    const thisWeek = parseInt(weekResult[0]?.count?.toString() || '0')

    // Get submissions this month
    const monthResult = await sql`
      SELECT COUNT(*) as count 
      FROM contact_submissions 
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    `
    const thisMonth = parseInt(monthResult[0]?.count?.toString() || '0')

    return NextResponse.json({
      total,
      unread,
      today,
      thisWeek,
      thisMonth,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

