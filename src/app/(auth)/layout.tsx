// frontend-user/src/app/(auth)/layout.tsx

import React from 'react'
import AuthLayoutClient from './layout-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s – VOICE AI',
    default: 'Authentication – VOICE AI',
  },
  description:
    'Secure authentication for your account. Sign in, register, or manage your password.',
  robots: {
    index: false,
    follow: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#4F46E5',
}

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  // AuthLayoutClient is the “client‐side” wrapper that does the redirect logic
  return <AuthLayoutClient>{children}</AuthLayoutClient>
}
