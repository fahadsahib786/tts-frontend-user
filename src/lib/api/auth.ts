// frontend-user/src/lib/api/auth.ts
import { useAuthStore } from '@/stores/authStore'
import {
  LoginCredentials,
  RegisterData,
  VerifyOtpData,       // { email: string; otp: string; }
  ResetPasswordData,
  LoginResponse,
  RegisterResponse,
  VerifyOtpResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  LogoutResponse,
  GetUserResponse,
} from '@/types/auth'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
// Make sure your .env (frontend-user/.env) has:
// NEXT_PUBLIC_API_URL=http://localhost:5000/api

class AuthAPI {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const token = useAuthStore.getState().token

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred')
    }
    return data
  }

  static async login(
    credentials: LoginCredentials
  ): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  static async register(
    data: RegisterData
  ): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // —————————————
  // Call /auth/verify-email (not /auth/verify-otp)
  // —————————————
  static async verifyOtp(
    data: VerifyOtpData
  ): Promise<VerifyOtpResponse> {
    return this.request<VerifyOtpResponse>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // ————————————————————
  // Call /auth/resend-verification (not /auth/resend-otp)
  // ————————————————————
  static async resendOtp(
    email: string
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      '/auth/resend-verification',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    )
  }

  static async forgotPassword(
    email: string
  ): Promise<ForgotPasswordResponse> {
    return this.request<ForgotPasswordResponse>(
      '/auth/forgot-password',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    )
  }

  static async resetPassword(
    data: ResetPasswordData
  ): Promise<ResetPasswordResponse> {
    return this.request<ResetPasswordResponse>(
      '/auth/reset-password',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
  }

  static async logout(): Promise<LogoutResponse> {
    useAuthStore.getState().logout()
    return this.request<LogoutResponse>('/auth/logout', {
      method: 'POST',
    })
  }

  static async getCurrentUser(): Promise<GetUserResponse> {
    return this.request<GetUserResponse>('/user/profile', {
      method: 'GET',
    })
  }
}

export default AuthAPI
