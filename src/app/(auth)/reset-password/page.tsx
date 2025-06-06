'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock } from 'lucide-react';
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

interface ValidationErrors {
  [key: string]: string;
}

interface PasswordStrength {
  strength: number;
  text: string;
  requirements: {
    text: string;
    met: boolean;
  }[];
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const getPasswordStrength = (password: string): PasswordStrength => {
    const requirements = [
      {
        text: 'At least 8 characters',
        met: password.length >= 8,
      },
      {
        text: 'Contains uppercase letter',
        met: /[A-Z]/.test(password),
      },
      {
        text: 'Contains lowercase letter',
        met: /[a-z]/.test(password),
      },
      {
        text: 'Contains number',
        met: /\d/.test(password),
      },
      {
        text: 'Contains special character',
        met: /[^A-Za-z0-9]/.test(password),
      },
    ];

    const metCount = requirements.filter(req => req.met).length;
    const strengthText = [
      'Very weak',
      'Weak',
      'Fair',
      'Good',
      'Strong'
    ][metCount - 1] || '';

    return {
      strength: metCount,
      text: strengthText,
      requirements,
    };
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    const passwordStrength = getPasswordStrength(formData.password);

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (passwordStrength.strength < 3) {
      errors.password = 'Password is too weak';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Invalid or expired reset token');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccess('Password has been reset successfully!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (!token) {
    return (
      <AuthCard>
        <AuthCardHeader>
          <AuthCardTitle>Invalid Reset Link</AuthCardTitle>
          <AuthCardDescription>
            This password reset link is invalid or has expired.
          </AuthCardDescription>
        </AuthCardHeader>
        <AuthCardFooter>
          <Link
            href="/forgot-password"
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Request a new reset link
          </Link>
        </AuthCardFooter>
      </AuthCard>
    );
  }

  return (
    <>
      <AuthCard>
        <AuthCardHeader>
          <AuthCardTitle>Reset your password</AuthCardTitle>
          <AuthCardDescription>
            Create a strong password for your account
          </AuthCardDescription>
        </AuthCardHeader>

        <AuthCardForm onSubmit={handleSubmit}>
          <AuthError message={error} />
          <AuthSuccess message={success} />
          
          <AuthInputGroup>
            <AuthInput
              label="New Password"
              type="password"
              icon={<Lock className="h-5 w-5" />}
              required
              autoFocus
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={validationErrors.password}
              placeholder="Create a strong password"
            />

            {formData.password && (
              <div className="space-y-2">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      passwordStrength.strength <= 2 ? 'bg-red-500' :
                      passwordStrength.strength === 3 ? 'bg-yellow-500' :
                      passwordStrength.strength === 4 ? 'bg-green-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  />
                </div>
                <div className="text-sm space-y-1">
                  <p className="text-gray-600">
                    Password strength: {passwordStrength.text}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {passwordStrength.requirements.map((req, index) => (
                      <li
                        key={index}
                        className={`flex items-center space-x-2 ${
                          req.met ? 'text-green-600' : 'text-gray-500'
                        }`}
                      >
                        <span className="text-xs">
                          {req.met ? '✓' : '○'}
                        </span>
                        <span className="text-xs">{req.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <AuthInput
              label="Confirm Password"
              type="password"
              icon={<Lock className="h-5 w-5" />}
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={validationErrors.confirmPassword}
              placeholder="Confirm your new password"
            />
          </AuthInputGroup>

          <Button
            type="submit"
            className="w-full py-2.5"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Resetting password...' : 'Reset password'}
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
          content="Create a new password for your account. Choose a strong password to keep your account secure."
        />
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href="https://yourapp.com/reset-password" />
      </head>
    </>
  );
}
