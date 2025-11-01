import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Hardcoded username
const ADMIN_USERNAME = 'jphenrikhof@gmail.com'

export async function getAdminSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')

  if (!session) {
    return null
  }

  try {
    const decoded = Buffer.from(session.value, 'base64').toString('utf-8')
    const [username] = decoded.split(':')
    return username === ADMIN_USERNAME ? session.value : null
  } catch {
    return null
  }
}

export async function requireAdmin() {
  const session = await getAdminSession()
  if (!session) {
    redirect('/management-panel')
  }
  return session
}

export function checkSecretKey(searchParams: { secretkey?: string }): boolean {
  const expectedKey = process.env.ADMIN_SECRET_KEY || 'your-secret-key-here'
  const providedKey = searchParams.secretkey

  if (!providedKey) {
    return false
  }

  // Simple comparison - in production, use proper hash comparison
  return providedKey === expectedKey
}

