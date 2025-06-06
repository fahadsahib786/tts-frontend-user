'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import AuthAPI from '@/lib/api/auth'
import {
  AuthCard,
  AuthCardHeader,
  AuthCardTitle,
  AuthCardDescription,
  AuthCardForm,
  AuthCardFooter,
} from '@/components/auth/auth-card'
import { AuthInput, AuthInputGroup, AuthError } from '@/components/auth/auth-input'
import type { LoginCredentials } from '@/types/auth'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // Call your backend login endpoint:
      // It should return something like { success: true, message: "...", data: { user, token } }
      const resp = await AuthAPI.login(formData)
      // If your AuthAPI.login throws on non-200, then we’re already in catch()
      // By your example response, you get back { success:true, message: "Login successful", data: { user, token } }
      // So:
      const { user, token } = (resp as any).data

      // 1) Tell our AuthContext to store them in localStorage + state:
      login(token, user)

      // 2) Redirect to wherever the user wanted to go:
      let redirectPath = '/dashboard'
      if (typeof window !== 'undefined') {
        const stored = sessionStorage.getItem('redirectAfterLogin')
        if (stored) {
          redirectPath = stored
          sessionStorage.removeItem('redirectAfterLogin')
        }
      }
      router.push(redirectPath)
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard>
      <AuthCardHeader>
        <AuthCardTitle>Welcome back</AuthCardTitle>
        <AuthCardDescription>Sign in to your account to continue</AuthCardDescription>
      </AuthCardHeader>

      <AuthCardForm onSubmit={handleSubmit}>
        <AuthError message={error} />

        <AuthInputGroup>
          <AuthInput
            label="Email address"
            type="email"
            required
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@example.com"
          />
          <AuthInput
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            placeholder="Enter your password"
          />
        </AuthInputGroup>

        <div className="flex items-center justify-end">
          <a
            href="/forgot-password"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Forgot password?
          </a>
        </div>

        <Button type="submit" className="w-full py-2.5" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </AuthCardForm>

      <AuthCardFooter>
        Don&apos;t have an account?{' '}
        <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign up
        </a>
      </AuthCardFooter>
    </AuthCard>
  )
}
