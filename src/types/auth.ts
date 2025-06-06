// frontend-user/src/types/auth.ts

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'user' | 'admin' | 'manager' | 'finance_admin' | 'super_admin';

  // Optional subscription object:
  subscription?: {
    _id: string;
    status: 'pending' | 'active' | 'cancelled' | 'expired' | 'inactive';
    plan: {
      _id: string;
      name: string;
      features: {
        charactersPerMonth: number;
        voicesAvailable: number;
        audioFormats: string[];
        apiAccess: boolean;
        prioritySupport: boolean;
        commercialUse: boolean;
      };
    };
    startDate: string;
    endDate: string;
    daysRemaining: number;
  };
}


export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface VerifyOtpResponse {
  message: string;
  token?: string;
  user?: User;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}

export interface GetUserResponse {
  user: User;
}
