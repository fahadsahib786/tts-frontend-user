'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function AuthInput({ 
  label, 
  error, 
  icon,
  className,
  type = 'text',
  ...props 
}: AuthInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <Input
          type={isPassword && showPassword ? 'text' : type}
          className={cn(
            'w-full',
            icon && 'pl-10',
            isPassword && 'pr-10',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}

export function AuthInputGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      {children}
    </div>
  );
}

export function AuthError({ message }: { message: string }) {
  if (!message) return null;
  
  return (
    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
      {message}
    </div>
  );
}

export function AuthSuccess({ message }: { message: string }) {
  if (!message) return null;
  
  return (
    <div className="rounded-lg bg-green-50 p-4 text-sm text-green-600">
      {message}
    </div>
  );
}
