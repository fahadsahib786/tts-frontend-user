import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2);
    const newToast = { id, title, description, variant };
    
    setToasts((currentToasts) => [...currentToasts, newToast]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((currentToasts) => 
        currentToasts.filter((toast) => toast.id !== id)
      );
    }, 5000);
  }, []);

  return { toast, toasts };
}

export { type Toast };
