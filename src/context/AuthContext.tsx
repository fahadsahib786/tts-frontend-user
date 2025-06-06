'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

/**
 * The shape of our "user" object coming from the backend.
 * Adjust fields if your API returns more/less.
 */
interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: 'user' | 'admin' | 'manager' | 'finance_admin' | 'super_admin'
  subscription?: {
    _id: string
    status: 'pending' | 'active' | 'cancelled' | 'expired'
    plan: {
      _id: string
      name: string
      features: {
        charactersPerMonth: number
        voicesAvailable: number
        audioFormats: string[]
        apiAccess: boolean
        prioritySupport: boolean
        commercialUse: boolean
      }
    }
    startDate: string
    endDate: string
    daysRemaining: number
  }
}

/**
 * The context value we'll provide to any component that calls useAuth().
 */
interface AuthContextValue {
  isAuthenticated: boolean
  token: string | null
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
}

/**
 * Create the context with a default (we'll override it in the Provider).
 */
const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
})

/**
 * Custom hook to read auth state from context.
 */
export function useAuth() {
  return useContext(AuthContext)
}

/**
 * AuthProvider wraps your entire app. It:
 *
 * 1) On first client‐side render (in useEffect), reads:
 *    localStorage.getItem('token') and localStorage.getItem('user')
 *    If found, parses and populates state { isAuthenticated:true, token, user }.
 *
 * 2) Exposes login(token,user) → saves to localStorage & updates state.
 * 3) Exposes logout() → clears localStorage & resets state.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  // 1) On mount, restore any stored token/user from localStorage
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')

      if (savedToken && savedUser) {
        const parsedUser: User = JSON.parse(savedUser)
        setToken(savedToken)
        setUser(parsedUser)
        setIsAuthenticated(true)
      }
    } catch (err) {
      console.error('AuthProvider mount error parsing localStorage:', err)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setIsAuthenticated(false)
      setToken(null)
      setUser(null)
    }
  }, [])

  /**
   * Call this after a successful login API. It:
   * - Saves both items to localStorage,
   * - Updates React state in context,
   * - Sets isAuthenticated = true.
   */
  const login = (newToken: string, newUser: User) => {
    try {
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      setToken(newToken)
      setUser(newUser)
      setIsAuthenticated(true)
    } catch (err) {
      console.error('AuthContext.login error saving to localStorage:', err)
    }
  }

  /**
   * Call this to log out:
   * - Clears localStorage,
   * - Resets React state,
   * - Redirects to /login.
   */
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setToken(null)
    setUser(null)
    router.push('/login')
  }

  const value: AuthContextValue = {
    isAuthenticated,
    token,
    user,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
