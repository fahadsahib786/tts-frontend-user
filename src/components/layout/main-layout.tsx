'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from './header'
import { useAuthStore } from '@/stores/authStore'

interface MainLayoutProps {

  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter()
  const { isAuthenticated, user, setUser, setToken } = useAuthStore()

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setToken(token)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
      }
    } else if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router, setUser, setToken])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
