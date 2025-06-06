'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showLogo?: boolean;
}

export function AuthCard({ children, showLogo = true, className, ...props }: AuthCardProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4 sm:px-6 lg:px-8">
      <Card 
        className={cn(
          "w-full max-w-md p-6 sm:p-8 space-y-6 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-0",
          className
        )} 
        {...props}
      >
        {showLogo && (
          <div className="flex justify-center">
            <div className="w-12 h-12 relative">
              <Image
                src="/VoiceAI_logo.png"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        )}
        {children}
      </Card>
      
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-blue-50 via-transparent to-transparent opacity-40" />
        <div className="absolute -bottom-1/2 -right-1/2 w-[200%] h-[200%] bg-gradient-radial from-indigo-50 via-transparent to-transparent opacity-40" />
      </div>
    </div>
  );
}

export function AuthCardHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center space-y-2">
      {children}
    </div>
  );
}

export function AuthCardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
      {children}
    </h1>
  );
}

export function AuthCardDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-gray-600">
      {children}
    </p>
  );
}

export function AuthCardFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center text-sm text-gray-600">
      {children}
    </div>
  );
}

export function AuthCardForm({ children, ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form className="space-y-4" {...props}>
      {children}
    </form>
  );
}
