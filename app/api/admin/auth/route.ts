import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Hardcoded credentials
const ADMIN_USERNAME = 'jphenrikhof@gmail.com'
const ADMIN_PASSWORD = 'f8a3b7c2d9e1' // 12-character hash
const SECRET_CODE = '9877' // Hardcoded secret code

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, secretCode } = body

    // Check secret code first - don't query server if wrong
    if (secretCode !== SECRET_CODE) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check username and password
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create session token
    const sessionToken = Buffer.from(
      `${username}:${Date.now()}`
    ).toString('base64')

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  return NextResponse.json({ success: true })
}

