// frontend-user/src/lib/api/subscription.ts

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const subscriptionClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
subscriptionClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

subscriptionClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface Plan {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: 'monthly' | 'yearly' | 'lifetime';
  features: {
    charactersPerMonth: number;
    voicesAvailable: number;
    audioFormats: string[];
    apiAccess: boolean;
    prioritySupport: boolean;
    commercialUse: boolean;
  };
  isActive: boolean;
  sortOrder: number;
}

export interface Subscription {
  _id: string;
  status: 'pending' | 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  paymentMethod: 'stripe' | 'paypal' | 'manual';
  paymentAmount: number;
  paymentCurrency: string;
  paymentProofUrl?: string;
  plan: Plan;
  daysRemaining: number;
  isExpired: boolean;
  isActive: boolean;
}

export interface PaymentInstructions {
  amount: number;
  currency: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    routingNumber: string;
    swiftCode: string;
  };
  instructions: string[];
  subscriptionId: string;
}

export interface SubscriptionResponse {
  subscription: Subscription;
  paymentInstructions?: PaymentInstructions;
}

// 1) Get all active plans
export const getPlans = async (): Promise<Plan[]> => {
  const response = await subscriptionClient.get('/plans');
  // backend sends { success:true, data: [ … ] }
  return response.data.data as Plan[];
};

// 2) Get single plan details (if you ever need it)
export const getPlan = async (planId: string): Promise<Plan> => {
  const response = await subscriptionClient.get(`/plans/${planId}`);
  return response.data.data as Plan;
};

// 3) Subscribe to a plan (manual payment by default)
export const subscribeToPlan = async (
  planId: string
): Promise<SubscriptionResponse> => {
  const response = await subscriptionClient.post('/plans/subscribe', {
    planId,
    paymentMethod: 'manual',
  });
  return response.data.data as SubscriptionResponse;
};

// 4) Get current subscription details (404 => null)
export const getSubscription = async (): Promise<Subscription | null> => {
  try {
    const response = await subscriptionClient.get('/plans/subscription/details');
    return response.data.data as Subscription;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// 5) Cancel subscription
export const cancelSubscription = async (reason?: string): Promise<void> => {
  await subscriptionClient.delete('/plans/subscription', {
    data: { reason },
  });
};

// 6) Upload payment proof
export const uploadPaymentProof = async (
  subscriptionId: string,
  file: File
): Promise<void> => {
  const formData = new FormData();
  formData.append('paymentProof', file);
  await subscriptionClient.post(
    `/plans/subscription/${subscriptionId}/payment-proof`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

// 7) Get a presigned view URL for the proof
export const getPaymentProofUrl = async (subscriptionId: string): Promise<string> => {
  const response = await subscriptionClient.get(
    `/plans/subscription/${subscriptionId}/payment-proof`
  );
  return response.data.data.viewUrl as string;
};
