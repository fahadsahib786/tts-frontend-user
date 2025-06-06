'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  AuthCard, 
  AuthCardHeader, 
  AuthCardTitle, 
  AuthCardDescription, 
  AuthCardForm, 
  AuthCardFooter 
} from '@/components/auth/auth-card';
import { 
  AuthInput, 
  AuthInputGroup, 
  AuthError,
  AuthSuccess 
} from '@/components/auth/auth-input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setSuccess('Password reset instructions have been sent to your email');
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AuthCard>
        <AuthCardHeader>
          <AuthCardTitle>Reset your password</AuthCardTitle>
          <AuthCardDescription>
            Enter your email address and we&apos;ll send you instructions to reset your password
          </AuthCardDescription>
        </AuthCardHeader>

        <AuthCardForm onSubmit={handleSubmit}>
          <AuthError message={error} />
          <AuthSuccess message={success} />
          
          <AuthInputGroup>
            <AuthInput
              label="Email address"
              type="email"
              icon={<Mail className="h-5 w-5" />}
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              disabled={isSubmitting}
            />
          </AuthInputGroup>

          <Button
            type="submit"
            className="w-full py-2.5"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending instructions...' : 'Send reset instructions'}
          </Button>
        </AuthCardForm>

        <AuthCardFooter>
          Remember your password?{' '}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Back to login
          </Link>
        </AuthCardFooter>
      </AuthCard>

      {/* SEO Metadata */}
      <head>
        <title>Reset Password - Your App Name</title>
        <meta
          name="description"
          content="Reset your password to regain access to your account. We'll send you instructions to create a new password."
        />
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href="https://yourapp.com/forgot-password" />
      </head>
    </>
  );
}
