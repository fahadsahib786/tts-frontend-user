'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AuthAPI from '@/lib/api/auth';
import { 
  AuthCard, 
  AuthCardHeader, 
  AuthCardTitle, 
  AuthCardDescription, 
  AuthCardForm, 
  AuthCardFooter 
} from '@/components/auth/auth-card';
import { 
  AuthError,
  AuthSuccess,
  AuthInputGroup 
} from '@/components/auth/auth-input';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const { setUser, setToken } = useAuthStore();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  useEffect(() => {
    if (!email) {
      router.push('/login');
    }
  }, [email, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }
    if (!/^\d*$/.test(value)) {
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto‐focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // ————————————
  // Call AuthAPI.verifyOtp (not verifyEmail)
  // ————————————
  const verifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError('');
    setSuccess('');

    try {
      // Use verifyOtp according to your AuthAPI
      const response = await AuthAPI.verifyOtp({ email: email!, otp: otpString });

      // Response shape: { success: true, message: string, data?: { user, token } }
      setSuccess(response.message || 'Email verified!');

      if (response.data?.token && response.data?.user) {
        setToken(response.data.token);
        setUser(response.data.user);
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setError('');
    setSuccess('');

    try {
      const response = await AuthAPI.resendOtp(email!);
      setSuccess(response.message || 'OTP resent to your email.');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <AuthCard>
        <AuthCardHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-indigo-600" />
          </div>
          <AuthCardTitle>Verify your email</AuthCardTitle>
          <AuthCardDescription>
            Enter the 6-digit code sent to {email}
          </AuthCardDescription>
        </AuthCardHeader>

        <AuthCardForm onSubmit={(e) => { e.preventDefault(); verifyOtp(); }}>
          <AuthError message={error} />
          <AuthSuccess message={success} />

          <AuthInputGroup>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl font-semibold"
                  autoComplete="off"
                />
              ))}
            </div>
          </AuthInputGroup>

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isVerifying || otp.join('').length !== 6}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleResendOtp}
              disabled={isResending || countdown > 0}
              className="w-full"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : countdown > 0 ? (
                `Resend code in ${countdown}s`
              ) : (
                'Resend code'
              )}
            </Button>
          </div>
        </AuthCardForm>

        <AuthCardFooter>
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Back to login
          </Link>
        </AuthCardFooter>
      </AuthCard>
    </>
  );
}
