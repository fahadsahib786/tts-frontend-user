// frontend-user/src/app/dashboard/layout.tsx
'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Loader2, Menu as MenuIcon, X as CloseIcon } from 'lucide-react'
import Link from 'next/link'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAuth()

  // Always call hooks in the same order
  const [hasMounted, setHasMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // 1) Prevent SSR/client mismatch by waiting for mount
  useEffect(() => {
    setHasMounted(true)
  }, [])

  // 2) Redirect to /login if not authenticated (after mount)
  useEffect(() => {
    if (hasMounted && !isAuthenticated) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
      }
      logout()
      router.push('/login')
    }
  }, [hasMounted, isAuthenticated, logout, router])

  // 3) While waiting to confirm mount, show spinner
  if (!hasMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    )
  }

  // 4) If mounted but still not authenticated, render nothing (redirecting)
  if (!isAuthenticated) {
    return null
  }

  // 5) Utility: return true if `href` matches current path
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  // 6) Navigation links configuration
  const navLinks: { href: string; label: string }[] = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/generate', label: 'Generate' },
    { href: '/dashboard/files', label: 'Files' },
    { href: '/dashboard/subscription', label: 'Subscription' },
    { href: '/dashboard/profile', label: 'Profile' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ─────────────────────────────────────────────
          Top Navigation Bar
      ───────────────────────────────────────────── */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo + Desktop Links */}
            <div className="flex items-center">
              <Link href="/dashboard" className="flex-shrink-0">
                <span className="text-2xl font-extrabold text-indigo-600">
                  TTS App
                </span>
              </Link>
              <div className="hidden md:flex md:space-x-8 md:ml-10">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'border-indigo-600 text-gray-900'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Logout (desktop) + Hamburger (mobile) */}
            <div className="flex items-center">
              <button
                onClick={() => {
                  logout()
                  router.push('/login')
                }}
                className="hidden md:inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
              >
                Logout
              </button>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
                aria-label="Toggle navigation"
              >
                {menuOpen ? (
                  <CloseIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            Mobile Menu (shown when menuOpen is true)
        ───────────────────────────────────────────── */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  logout()
                  router.push('/login')
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ─────────────────────────────────────────────
          Main Content
      ───────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
