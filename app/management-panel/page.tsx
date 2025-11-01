'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import LoginForm from './login-form'

function ManagementPanelContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isValidKey, setIsValidKey] = useState<boolean | null>(null)

  useEffect(() => {
    const secretKey = searchParams.get('secretkey')
    
    // Check secret key - you should set this in your environment
    // For security, use a strong hash
    const expectedKey = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || 'your-secret-key-here'
    
    if (!secretKey || secretKey !== expectedKey) {
      // Redirect immediately
      router.push('/')
      return
    }

    setIsValidKey(true)
  }, [searchParams, router])

  if (isValidKey === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    )
  }

  if (isValidKey === false) {
    return null // Redirecting
  }

  return <LoginForm />
}

export default function ManagementPanelPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    }>
      <ManagementPanelContent />
    </Suspense>
  )
}

