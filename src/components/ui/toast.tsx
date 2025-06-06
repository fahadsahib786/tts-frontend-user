'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const toastVariants = cva(
  'fixed right-4 top-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-white text-gray-900',
        destructive: 'bg-red-600 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ToastProps extends VariantProps<typeof toastVariants> {
  title: string;
  description?: string;
  onClose?: () => void;
}

export function Toast({ title, description, variant, onClose }: ToastProps) {
  return (
    <div className={cn(toastVariants({ variant }))}>
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        {description && <p className="mt-1 text-sm">{description}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-full p-1 hover:bg-black/10"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export interface ToastProviderProps {
  children: React.ReactNode;
}

interface ToastState extends ToastProps {
  id: string;
}

interface ToastContextValue {
  toasts: ToastState[];
  toast: (props: ToastProps) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastState[]>([]);

  const toast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substring(2);
    setToasts((prev) => [...prev, { ...props, id }]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
      <div className="fixed right-0 top-0 z-50 m-4 flex flex-col gap-2">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            {...t}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
