// frontend-user/src/app/layout.tsx

import './globals.css'
import { Metadata } from 'next'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: 'VoiceAI - Transform Text to Natural Speech with AI Technology',
    template: '%s | VoiceAI',
  },
  description:
    'Convert text to natural-sounding speech using advanced AI technology. Perfect for content creators, businesses, and developers.',
  keywords: [
    'text to speech',
    'AI voice generation',
    'speech synthesis',
    'voice AI',
    'content creation',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'http://localhost:3000',
    siteName: 'VoiceAI',
    title: 'VoiceAI - Transform Text to Natural Speech',
    description:
      'Create human-like voices for your content using cutting-edge AI technology.',
    images: [
      {
        url: '/hero-og.jpg',
        width: 1200,
        height: 630,
        alt: 'VoiceAI - Transform Text to Natural Speech',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VoiceAI - Transform Text to Natural Speech',
    description:
      'Create human-like voices for your content using cutting-edge AI technology.',
    images: ['/hero-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

/**
 * RootLayout is a Server Component. On the client side, <AuthProvider> will
 * rehydrate any previously-stored token + user from localStorage. Until that
 * runs, its children can read isAuthenticated=false (meaning: not logged in).
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
