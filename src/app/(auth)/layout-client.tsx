// frontend-user/src/app/(auth)/layout-client.tsx

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { ToastProvider } from '@/components/ui/toast'
import { Loader2 } from 'lucide-react'

export default function AuthLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  // We only run the redirect logic after the component has mounted on the client.
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    // If we're mounted AND already have a valid login, send straight to /dashboard.
    if (hasMounted && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [hasMounted, isAuthenticated, router])

  // While waiting for React to hydrate (hasMounted === false), show a spinner.
  if (!hasMounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  // Once hasMounted === true and isAuthenticated === false, render the login form UI.
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <main>{children}</main>
        {/* (You can keep your background decorations here if you like.) */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-30"
            style={{
              background:
                'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-[600px] h-[600px] opacity-20 transform rotate-45"
            style={{
              background:
                'linear-gradient(45deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%)',
            }}
          />
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] opacity-20 transform -rotate-45"
            style={{
              background:
                'linear-gradient(-45deg, rgba(67, 56, 202, 0.1) 0%, transparent 100%)',
            }}
          />
        </div>
      </div>
    </ToastProvider>
  )
}
