// frontend-user/src/app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'
import dayjs from 'dayjs'

interface UsageStats {
  charactersUsed: number
  charactersLimit: number
  audioFilesGenerated: number
  totalAudioDuration: number
  remainingCharacters: number
}

interface Subscription {
  _id: string
  status: 'pending' | 'active' | 'cancelled' | 'expired' | 'inactive'
  plan: {
    _id: string
    name: string
    features: {
      charactersPerMonth: number
      voicesAvailable: number
      audioFormats: string[]
      apiAccess: boolean
      prioritySupport: boolean
      commercialUse: boolean
      storageLimitMB: number
    }
  }
  startDate: string
  endDate: string
  daysRemaining: number
  isExpired: boolean
  isActive: boolean
  paymentMethod: string
  paymentAmount: number
  paymentCurrency: string
}

interface VoiceFile {
  id: string
  fileSize: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { token, isAuthenticated, user } = useAuth()

  const [usage, setUsage] = useState<UsageStats | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [storageUsedMB, setStorageUsedMB] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setLoading(false)
      return
    }

    const fetchAll = async () => {
      setLoading(true)
      setError('')
      try {
        // 1) Fetch usage stats
        const usageRes = await apiClient.getUsageStats()
        if (usageRes.success) {
          setUsage(usageRes.data as UsageStats)
        } else {
          console.error('Usage fetch error:', usageRes.error)
        }

        // 2) Fetch subscription details
        try {
          const subRes = await apiClient.getSubscription()
          if (subRes.success) {
            // Convert dates to ISO strings for consistency
            const sub: Subscription = subRes.data
            setSubscription(sub)
          } else {
            // No subscription found or other error
            if (!subRes.error.toLowerCase().includes('no subscription')) {
              console.error('Subscription fetch error:', subRes.error)
            }
            setSubscription(null)
          }
        } catch (subErr: any) {
          if (subErr.response?.status === 404) {
            setSubscription(null)
          } else if (
            subErr.response?.status === 401 ||
            subErr.message.toLowerCase().includes('unauthorized')
          ) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            router.push('/login')
            return
          } else {
            console.error('Subscription fetch exception:', subErr)
            setSubscription(null)
          }
        }

        // 3) Fetch all voice files for storage usage
        //    We request a high limit (e.g., 1000) to cover most users
        const filesRes = await apiClient.getVoiceFiles({ page: 1, limit: 1000 })
        if (filesRes.success) {
          const allFiles: VoiceFile[] = filesRes.data.voiceFiles
          const totalBytes = allFiles.reduce((sum, f) => sum + f.fileSize, 0)
          setStorageUsedMB(Number((totalBytes / (1024 * 1024)).toFixed(2)))
        } else {
          console.error('Voice files fetch error:', filesRes.error)
        }
      } catch (err: unknown) {
        const e = err instanceof Error ? err : new Error('Unknown error')
        console.error('Dashboard fetch error:', e)
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [isAuthenticated, token, router])

  const formatNumber = (num: number | undefined, fallback = '0') =>
    typeof num === 'number' ? num.toLocaleString() : fallback

  const percentUsed = (used: number | undefined, limit: number | undefined) => {
    if (typeof used === 'number' && typeof limit === 'number' && limit > 0) {
      return Math.min((used / limit) * 100, 100)
    }
    return 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Welcome & Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            {subscription && subscription.isActive && (
              <p className="mt-1 text-sm text-gray-600">
                Plan: <span className="font-medium">{subscription.plan.name}</span> &middot;{' '}
                {subscription.daysRemaining} day
                {subscription.daysRemaining === 1 ? '' : 's'} remaining
              </p>
            )}
          </div>
          <Button onClick={() => router.push('/dashboard/generate')} className="shrink-0">
            Generate New Audio
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-md shadow-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Characters Card */}
          <Card className="shadow-lg rounded-lg">
            <CardHeader className="bg-white p-6">
              <CardTitle className="text-lg font-semibold">Characters Used</CardTitle>
            </CardHeader>
            <CardContent className="bg-white p-6 space-y-2">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-indigo-600 mr-2">
                  {formatNumber(usage?.charactersUsed)}
                </span>
                <span className="text-sm text-gray-500">
                  /{formatNumber(usage?.charactersLimit)}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500"
                  style={{
                    width: `${percentUsed(usage?.charactersUsed, usage?.charactersLimit)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-600">
                Remaining: {formatNumber(usage?.remainingCharacters)}
              </p>
            </CardContent>
          </Card>

          {/* Files Generated Card */}
          <Card className="shadow-lg rounded-lg">
            <CardHeader className="bg-white p-6">
              <CardTitle className="text-lg font-semibold">Files Generated</CardTitle>
            </CardHeader>
            <CardContent className="bg-white p-6">
              <p className="text-3xl font-bold text-indigo-600">
                {formatNumber(usage?.audioFilesGenerated)}
              </p>
              <p className="text-sm text-gray-500 mt-1">This month</p>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/files')}
                className="mt-4 w-full"
              >
                View All Files
              </Button>
            </CardContent>
          </Card>

          {/* Storage Used Card */}
          <Card className="shadow-lg rounded-lg">
            <CardHeader className="bg-white p-6">
              <CardTitle className="text-lg font-semibold">Storage Used</CardTitle>
            </CardHeader>
            <CardContent className="bg-white p-6 space-y-2">
              <p className="text-2xl font-bold text-indigo-600">{storageUsedMB} MB</p>
              {subscription?.plan.features.storageLimitMB ? (
                <>
                  <p className="text-sm text-gray-500">
                    / {subscription.plan.features.storageLimitMB} MB
                  </p>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-indigo-500"
                      style={{
                        width: `${
                          percentUsed(storageUsedMB, subscription.plan.features.storageLimitMB) 
                        }%`,
                      }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">No storage limit set</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Subscription Details */}
        {subscription ? (
          <Card className="shadow-lg rounded-lg">
            <CardHeader className="bg-white p-6">
              <CardTitle className="text-lg font-semibold">Subscription Details</CardTitle>
              <CardDescription className="text-gray-500">
                Your current active plan information
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-white p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm text-gray-600">Plan Name</h3>
                <p className="font-medium text-gray-900">{subscription.plan.name}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Status</h3>
                <p
                  className={`font-medium ${
                    subscription.status === 'active'
                      ? 'text-green-600'
                      : subscription.status === 'pending'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Start Date</h3>
                <p className="font-medium text-gray-900">
                  {dayjs(subscription.startDate).format('MMM D, YYYY')}
                </p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600">End Date</h3>
                <p className="font-medium text-gray-900">
                  {dayjs(subscription.endDate).format('MMM D, YYYY')}
                </p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Days Remaining</h3>
                <p className="font-medium text-gray-900">{subscription.daysRemaining}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Payment Method</h3>
                <p className="font-medium text-gray-900">{subscription.paymentMethod}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Payment Amount</h3>
                <p className="font-medium text-gray-900">
                  {subscription.paymentCurrency} {subscription.paymentAmount.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg rounded-lg bg-yellow-50 border-yellow-200">
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-semibold text-yellow-900">
                No Active Subscription
              </CardTitle>
              <CardDescription className="text-yellow-700">
                You don’t have an active subscription. Please upgrade to continue.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Button onClick={() => router.push('/dashboard/subscription')}>
                View Plans
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
