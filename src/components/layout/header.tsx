'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-indigo-900 bg-opacity-90 shadow-lg'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${isScrolled ? 'text-indigo-600' : 'text-white'}`}>
              VoiceAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features" className={`${isScrolled ? 'text-gray-600' : 'text-white'} hover:text-indigo-500`}>
              Features
            </Link>
            <Link href="/pricing" className={`${isScrolled ? 'text-gray-600' : 'text-white'} hover:text-indigo-500`}>
              Pricing
            </Link>
            <Link href="/about" className={`${isScrolled ? 'text-gray-600' : 'text-white'} hover:text-indigo-500`}>
              About
            </Link>
            <Link href="/contact" className={`${isScrolled ? 'text-gray-600' : 'text-white'} hover:text-indigo-500`}>
              Contact
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  className={`${isScrolled ? 'text-gray-600' : 'text-white'} hover:text-indigo-500`}
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
                <Button
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={() => router.push('/register')}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <Button
                className="bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={() => router.push('/dashboard')}
              >
                Dashboard
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-lg mt-2 p-4 absolute left-4 right-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/features" className="text-gray-600 hover:text-indigo-500">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-indigo-500">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-indigo-500">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-indigo-500">
                Contact
              </Link>
              <hr className="my-2" />
              {!isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-center"
                    onClick={() => router.push('/login')}
                  >
                    Login
                  </Button>
                  <Button
                    className="w-full justify-center bg-indigo-600 text-white hover:bg-indigo-700"
                    onClick={() => router.push('/register')}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full justify-center bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={() => router.push('/dashboard')}
                >
                  Dashboard
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
