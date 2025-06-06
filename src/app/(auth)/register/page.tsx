'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Phone } from 'lucide-react';
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
  AuthError 
} from '@/components/auth/auth-input';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      errors.phone = 'Invalid phone number';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and numbers';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getPasswordStrength = (password: string): { strength: number; text: string } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const strengthText = [
      'Very weak',
      'Weak',
      'Fair',
      'Good',
      'Strong'
    ][strength - 1] || '';

    return { strength, text: strengthText };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <>
      <AuthCard>
        <AuthCardHeader>
          <AuthCardTitle>Create an account</AuthCardTitle>
          <AuthCardDescription>
            Sign up to get started with our service
          </AuthCardDescription>
        </AuthCardHeader>

        <AuthCardForm onSubmit={handleSubmit}>
          <AuthError message={error} />
          
          <AuthInputGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AuthInput
                label="First Name"
                icon={<User className="h-5 w-5" />}
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                error={validationErrors.firstName}
                placeholder="John"
              />
              <AuthInput
                label="Last Name"
                icon={<User className="h-5 w-5" />}
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                error={validationErrors.lastName}
                placeholder="Doe"
              />
            </div>

            <AuthInput
              label="Email address"
              type="email"
              icon={<Mail className="h-5 w-5" />}
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={validationErrors.email}
              placeholder="name@example.com"
            />

            <AuthInput
              label="Phone number"
              type="tel"
              icon={<Phone className="h-5 w-5" />}
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={validationErrors.phone}
              placeholder="+1 (555) 000-0000"
            />

            <AuthInput
              label="Password"
              type="password"
              icon={<Lock className="h-5 w-5" />}
              required
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
                <p className="text-sm text-gray-600">
                  Password strength: {passwordStrength.text}
                </p>
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
              placeholder="Confirm your password"
            />
          </AuthInputGroup>

          <Button
            type="submit"
            className="w-full py-2.5"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </AuthCardForm>

        <AuthCardFooter>
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Sign in
          </Link>
        </AuthCardFooter>
      </AuthCard>

    </>
  );
}
