'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import LoginForm from './login-form'

function ManagementPanelContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isValidKey, setIsValidKey] = useState<boolean | null>(null)

  useEffect(() => {
    // Allow access if secretkey is provided (no validation)
    const secretKey = searchParams.get('secretkey')
    
    if (!secretKey) {
      // Redirect if no secret key provided
      setTimeout(() => {
        router.push('/')
      }, 100)
      setIsValidKey(false)
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

