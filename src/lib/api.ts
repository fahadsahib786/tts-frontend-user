import axios, { AxiosInstance } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password })
    return response.data
  }

  async register(name: string, email: string, password: string) {
    const response = await this.client.post('/auth/register', { name, email, password })
    return response.data
  }

  async logout() {
    const response = await this.client.post('/auth/logout')
    return response.data
  }

  async forgotPassword(email: string) {
    const response = await this.client.post('/auth/forgot-password', { email })
    return response.data
  }

  async resetPassword(token: string, password: string) {
    const response = await this.client.post('/auth/reset-password', { token, password })
    return response.data
  }

  async verifyEmail(otp: string) {
    const response = await this.client.post('/auth/verify-email', { otp })
    return response.data
  }

  async resendOtp(email: string) {
    const response = await this.client.post('/auth/resend-otp', { email })
    return response.data
  }

  // User endpoints
  async getProfile() {
    const response = await this.client.get('/user/profile')
    return response.data
  }

  async updateProfile(name: string, email: string) {
    const response = await this.client.put('/user/profile', { name, email })
    return response.data
  }

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await this.client.put('/user/change-password', {
      currentPassword,
      newPassword,
    })
    return response.data
  }

  async getUsageStats() {
    const response = await this.client.get('/user/usage')
    return response.data
  }

  async getVoiceFiles() {
    const response = await this.client.get('/user/voice-files')
    return response.data
  }

  async deleteVoiceFile(fileId: string) {
    const response = await this.client.delete(`/user/voice-files/${fileId}`)
    return response.data
  }

  async deleteAccount(password: string) {
    const response = await this.client.delete('/user/account', {
      data: { password }
    })
    return response.data
  }

  // TTS endpoints
  async getVoices() {
    const response = await this.client.get('/tts/voices')
    return response.data
  }

  async previewVoice(voiceId: string, sampleText?: string) {
    const response = await this.client.post('/tts/preview', {
      voiceId,
      sampleText,
    })
    return response.data
  }

  async convertTextToSpeech(data: {
    text: string
    voiceId: string
    outputFormat?: string
    engine?: string
  }) {
    const response = await this.client.post('/tts/convert', data)
    return response.data
  }

  async getDownloadUrl(fileId: string) {
    const response = await this.client.get(`/tts/download/${fileId}`)
    return response.data
  }

  // Plans endpoints
  async getPlans() {
    const response = await this.client.get('/plans')
    return response.data
  }

  async getPlan(planId: string) {
    const response = await this.client.get(`/plans/${planId}`)
    return response.data
  }

  async subscribeToPlan(planId: string) {
    const response = await this.client.post('/plans/subscribe', { 
      planId,
      paymentMethod: 'manual'
    })
    return response.data
  }

  async getSubscription() {
    const response = await this.client.get('/plans/subscription/details')
    return response.data
  }

  async cancelSubscription(reason?: string) {
    const response = await this.client.delete('/plans/subscription', {
      data: { reason }
    })
    return response.data
  }

  async uploadPaymentProof(subscriptionId: string, file: File) {
    const formData = new FormData()
    formData.append('paymentProof', file)
    const response = await this.client.post(
      `/plans/subscription/${subscriptionId}/payment-proof`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  }

  async getPaymentProofUrl(subscriptionId: string) {
    const response = await this.client.get(`/plans/subscription/${subscriptionId}/payment-proof`)
    return response.data
  }
}

export const apiClient = new ApiClient()
