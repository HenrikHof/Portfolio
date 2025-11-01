import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Create the Neon serverless client
// This works seamlessly with Vercel's serverless functions and edge runtime
// The sql function is a tagged template literal that accepts SQL strings
// Usage: sql`SELECT * FROM table WHERE id = ${id}`
export const sql = neon(process.env.DATABASE_URL)

// Example usage in API routes:
// import { sql } from '@/lib/db'
// const rows = await sql`SELECT * FROM users WHERE email = ${email}`

// Test connection function
export async function testConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}

