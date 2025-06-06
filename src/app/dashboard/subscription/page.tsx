'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import { useAuth } from '@/context/AuthContext'
import { apiClient } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa'
import { Tooltip } from '@/components/ui/tooltip'

//
// ─── TYPES ────────────────────────────────────────────────────────────────────
// Matches your backend response shapes exactly.
interface Plan {
  _id: string
  name: string
  description: string
  price: number
  currency: string
  duration: 'monthly' | 'yearly' | 'lifetime'
  features: {
    charactersPerMonth: number
    voicesAvailable: number
    audioFormats: string[]
    apiAccess: boolean
    prioritySupport: boolean
    commercialUse: boolean
  }
  isActive: boolean
  isTrial?: boolean
  trialDays?: number
  isPopular?: boolean
  discount?: number
}

interface Subscription {
  _id: string
  status: 'pending' | 'active' | 'cancelled' | 'expired' | 'inactive'
  plan: { _id: string; name: string }
  startDate: string
  endDate: string
  autoRenew: boolean
  paymentMethod: 'manual' | 'stripe' | 'paypal'
  paymentAmount: number
  paymentCurrency: string
  paymentProofKey?: string
  paymentProofUrl?: string
  daysRemaining: number
  isExpired: boolean
  isActive: boolean
}
// ───────────────────────────────────────────────────────────────────────────────

export default function SubscriptionPage() {
  const router = useRouter()
  const { token, logout } = useAuth()

  // Wait until after mount, to avoid SSR mismatch
  const [hasMounted, setHasMounted] = useState(false)

  // Current wizard step: 1=Select Plan, 2=Upload Proof, 3=Review & Confirm
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // All “active” plans
  const [plans, setPlans] = useState<Plan[]>([])
  // User’s existing subscription (if any)
  const [subscription, setSubscription] = useState<Subscription | null>(null)

  // The plan ID the user clicked in step 1
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  // Always “manual” for now
  const [paymentMethod, setPaymentMethod] = useState<'manual'>('manual')
  // File that the user chooses in step 2
  const [paymentProof, setPaymentProof] = useState<File | null>(null)

  // UI state
  const [loading, setLoading] = useState(true)        // initial data load
  const [submitting, setSubmitting] = useState(false) // submission in step 3
  const [error, setError] = useState<string>('')       // show in red banner

  useEffect(() => {
    setHasMounted(true)
  }, [])

  //
  // If any API call returns 401, we force logout → /login
  //
  function handleUnauthorized() {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
    }
    logout()
    router.push('/login')
  }

  //
  // ─── LOAD PLANS + EXISTING SUBSCRIPTION ──────────────────────────────────────
  //
  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    if (!token) {
      // If no token, bail; the layout's useEffect will redirect to /login
      setLoading(false)
      return
    }

    try {
      // 1) GET all active plans
      const plansRes = await apiClient.getPlans()
      if (!plansRes || typeof plansRes !== 'object' || !('data' in plansRes)) {
        throw new Error('Unexpected response from /api/plans')
      }
      if ((plansRes as any).success === false) {
        const errMsg = (plansRes as any).error || 'Failed to load plans'
        if ((plansRes as any).status === 401 || errMsg.toLowerCase().includes('unauthorized')) {
          handleUnauthorized()
          return
        }
        throw new Error(errMsg)
      }
      const allPlans = (plansRes as any).data as Plan[]
      setPlans(allPlans.filter(p => p.isActive))

      // 2) GET existing subscription
      try {
        const subRes = await apiClient.getSubscription()
        console.log('Fetched subscription:', subRes)
        if (subRes && (subRes as any).success) {
          // The subscription data is in subRes.data, not in subRes itself
          setSubscription((subRes as any).data as Subscription)
        } else {
          const msg = (subRes as any).error || ''
          if (msg.toLowerCase().includes('no subscription')) {
            // 404 → no subscription
            setSubscription(null)
          } else {
            throw new Error(msg || 'Failed to fetch subscription')
          }
        }
      } catch (subErr: any) {
        if (subErr.response?.status === 404) {
          setSubscription(null)
        } else if (
          subErr.response?.status === 401 ||
          subErr.message.toLowerCase().includes('unauthorized')
        ) {
          handleUnauthorized()
          return
        } else {
          console.error('Unexpected subscription error:', subErr)
          setSubscription(null)
        }
      }
    } catch (err: any) {
      console.error('loadData error:', err)
      const msg = (err.message || '').toLowerCase()
      if (msg.includes('unauthorized') || err.response?.status === 401) {
        handleUnauthorized()
        return
      }
      setError(err.message || 'An error occurred while loading data')
      setPlans([])
      setSubscription(null)
    } finally {
      setLoading(false)
    }
  }, [token, logout, router])

  useEffect(() => {
    if (hasMounted && token) {
      loadData()
    }
  }, [hasMounted, token, loadData])

  //
  // If not authenticated → redirect to /login
  //
  useEffect(() => {
    if (hasMounted && !token) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
      }
      logout()
      router.push('/login')
    }
  }, [hasMounted, token, logout, router])

  //
  // ─── STEP 1: Select a Plan ───────────────────────────────────────────────────
  //
  const handlePlanClick = (planId: string) => {
    if (!token) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', '/dashboard/subscription')
      }
      router.push('/login')
      return
    }
    setError('')
    setSelectedPlanId(planId)
    setStep(2)
  }

  //
  // ─── STEP 2: Upload Payment Proof ────────────────────────────────────────────
  //
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentProof(e.target.files?.[0] ?? null)
  }

  //
  // ─── STEP 3: Review & Confirm ────────────────────────────────────────────────
  //
  const handleSubmit = async () => {
    setError('')

    // Guard: must have selectedPlanId
    if (!selectedPlanId) {
      setError('Please select a plan first.')
      setStep(1)
      return
    }
    // Guard: must have a file in step 2
    if (!paymentProof) {
      setError('Please upload payment proof.')
      setStep(2)
      return
    }
    // Guard: must still be authenticated
    if (!token) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', '/dashboard/subscription')
      }
      router.push('/login')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      // 1) Create the subscription (manual → sets status: “pending”)
      let subscribeRes
      try {
        subscribeRes = await apiClient.subscribeToPlan(selectedPlanId)
      } catch (err: any) {
        // If create‐subscription itself fails, show its error in the banner
        const msg = err.response?.data?.error || err.message || 'Failed to create subscription'
        if (err.response?.status === 401 || msg.toLowerCase().includes('unauthorized')) {
          handleUnauthorized()
          return
        }
        setError(msg)
        setSubmitting(false)
        return
      }

      // Extract the new subscription ID from subscribeRes
      // subscribeRes.data.subscription._id
      const subscriptionId = (subscribeRes as any).data.subscription._id

      // 2) Upload payment proof
      try {
        await apiClient.uploadPaymentProof(subscriptionId, paymentProof)
      } catch (err: any) {
        const msg = err.response?.data?.error || err.message || 'Failed to upload payment proof'
        if (err.response?.status === 401 || msg.toLowerCase().includes('unauthorized')) {
          handleUnauthorized()
          return
        }
        setError(msg)
        setSubmitting(false)
        return
      }

      // 3) Reload subscription & plans data
      await loadData()

      // Move to step 3 (Pending/Review UI)
      setStep(3)
    } finally {
      setSubmitting(false)
    }
  }

  //
  // ─── STEP NAVIGATION HELPERS ────────────────────────────────────────────────
  //
  const goToStep1 = () => {
    setError('')
    setStep(1)
    setSelectedPlanId(null)
    setPaymentProof(null)
  }
  const goToStep2 = () => {
    if (!selectedPlanId) {
      setError('Please select a plan first.')
      setStep(1)
      return
    }
    setError('')
    setStep(2)
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────
  //
  // 1) While fetching data, show spinner
  if (!hasMounted || loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Subscription – VoiceAI</title>
        <meta
          name="description"
          content="Pick a subscription plan, upload payment proof, and get your AI voice generation service activated."
        />
        <meta name="keywords" content="VoiceAI, subscription, text-to-speech, plans" />
      </Head>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Subscription Plans</h1>

        {/* ─── EXISTING SUBSCRIPTION ─────────────────────────────────────────────── */}
        {subscription && (
          <Card className="mb-8 p-6 bg-white shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Your Current Subscription</h2>
            <div className="space-y-2">
            <p>
              <strong>Plan:</strong> {subscription?.plan?.name || 'No active plan'}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={`font-medium ${
                  subscription?.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                }`}
              >
                {subscription?.status 
                  ? subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)
                  : 'Inactive'}
              </span>
            </p>
            <p>
              <strong>Expires:</strong>{' '}
              {subscription?.endDate 
                ? new Date(subscription.endDate).toLocaleDateString()
                : 'N/A'}
            </p>
            <p>
              <strong>Days Remaining:</strong> {subscription?.daysRemaining || 0}
            </p>
            </div>
          </Card>
        )}

        {/* If no subscription, show a yellow banner */}
        {!subscription && (
          <div className="mb-8 px-4 py-4 bg-yellow-50 border-l-4 border-yellow-400">
            <p className="text-yellow-700">
              You don’t have an active subscription. Follow the steps below to get started.
            </p>
          </div>
        )}

        {/* ─── ERROR BANNER ──────────────────────────────────────────────────────── */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* ─── STEP INDICATOR BAR ───────────────────────────────────────────────── */}
        <div className="flex items-center space-x-2 mb-8">
          <div
            className={`flex items-center justify-center h-8 w-8 rounded-full text-white font-medium ${
              step === 1 ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
          >
            1
          </div>
          <span className={`text-sm ${step === 1 ? 'font-semibold' : 'text-gray-500'}`}>
            Select Plan
          </span>

          <div className="h-px flex-1 bg-gray-300" />

          <div
            className={`flex items-center justify-center h-8 w-8 rounded-full text-white font-medium ${
              step === 2 ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
          >
            2
          </div>
          <span className={`text-sm ${step === 2 ? 'font-semibold' : 'text-gray-500'}`}>
            Payment Proof
          </span>

          <div className="h-px flex-1 bg-gray-300" />

          <div
            className={`flex items-center justify-center h-8 w-8 rounded-full text-white font-medium ${
              step === 3 ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
          >
            3
          </div>
          <span className={`text-sm ${step === 3 ? 'font-semibold' : 'text-gray-500'}`}>
            Review & Confirm
          </span>
        </div>

        {/* ─── STEP 1: PLAN SELECTION ────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {plans.length > 0 ? (
              plans.map((plan) => (
                <Card
                  key={plan._id}
                  className={`p-6 border rounded-lg hover:shadow-lg transition ${
                    selectedPlanId === plan._id
                      ? 'ring-2 ring-indigo-500'
                      : 'border-gray-200'
                  }`}
                  onClick={() => handlePlanClick(plan._id)}
                >
                  <div className="flex flex-col h-full">
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline text-gray-900">
                      <span className="text-4xl font-extrabold">
                        ${plan.price.toFixed(2)}
                      </span>
                      <span className="ml-1 text-lg font-semibold text-gray-600">
                        /{plan.duration === 'yearly' ? 'year' : 'mo'}
                      </span>
                    </div>
                    <p className="mt-3 text-gray-500 flex-1">{plan.description}</p>
                    <ul className="mt-4 space-y-2 text-gray-600 flex-1">
                      <li className="flex items-center">
                        <FaCheck className="text-green-500 mr-2" />
                        {plan.features.charactersPerMonth.toLocaleString()} chars/mo
                      </li>
                      <li className="flex items-center">
                        <FaCheck className="text-green-500 mr-2" />
                        {plan.features.voicesAvailable} voice
                        {plan.features.voicesAvailable > 1 ? 's' : ''}
                      </li>
                      <li className="flex items-center">
                        <FaCheck className="text-green-500 mr-2" />
                        Formats: {plan.features.audioFormats.join(', ')}
                      </li>
                      {plan.features.apiAccess && (
                        <li className="flex items-center">
                          <FaCheck className="text-green-500 mr-2" />
                          API Access
                        </li>
                      )}
                      {plan.features.prioritySupport && (
                        <li className="flex items-center">
                          <FaCheck className="text-green-500 mr-2" />
                          Priority Support
                        </li>
                      )}
                      {plan.features.commercialUse && (
                        <li className="flex items-center">
                          <FaCheck className="text-green-500 mr-2" />
                          Commercial Use
                        </li>
                      )}
                    </ul>
                    <Button
                      onClick={() => handlePlanClick(plan._id)}
                      variant={selectedPlanId === plan._id ? 'default' : 'outline'}
                      className="mt-6"
                    >
                      {selectedPlanId === plan._id ? 'Selected' : 'Select Plan'}
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-3">
                No subscription plans available at this time.
              </p>
            )}
          </div>
        )}

        {/* ─── STEP 2: UPLOAD PAYMENT PROOF ────────────────────────────────────── */}
        {step === 2 && (
          <Card className="mb-8 p-8 bg-white shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Upload Payment Proof</h2>
            <p className="mb-6 text-gray-600">
              You selected:{' '}
              <span className="font-medium">
                {plans.find((p) => p._id === selectedPlanId)?.name ?? 'Unknown Plan'}
              </span>
            </p>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="manual"
                    checked={paymentMethod === 'manual'}
                    onChange={() => setPaymentMethod('manual')}
                    className="h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <span className="font-medium text-gray-800">Bank Transfer / Manual</span>
                </label>
                <p className="text-sm text-gray-500 ml-7">
                  You’ll see account details on the final review screen.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Upload Proof</h3>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:text-sm file:font-semibold
                           file:bg-indigo-50 file:text-indigo-700
                           hover:file:bg-indigo-100"
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={goToStep1}>
                ← Back to Plans
              </Button>
              <Button onClick={() => setStep(3)} disabled={!paymentProof}>
                Continue to Review
              </Button>
            </div>
          </Card>
        )}

        {/* ─── STEP 3: REVIEW & CONFIRM ───────────────────────────────────────────── */}
        {step === 3 && (
          <Card className="mb-8 p-8 bg-white shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Review & Confirm</h2>

            {/* Plan Name (guarded with ?. so we don’t crash) */}
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-gray-600">
                  <strong>Plan:</strong>{' '}
                  {plans.find((p) => p._id === selectedPlanId)?.name ?? 'Unknown Plan'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  <strong>Price:</strong>{' '}
                  $
                  {(
                    plans.find((p) => p._id === selectedPlanId)?.price ?? 0
                  ).toFixed(2)}{' '}
                  /{' '}
                  {plans.find((p) => p._id === selectedPlanId)?.duration === 'yearly'
                    ? 'year'
                    : 'month'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  <strong>Payment Method:</strong>{' '}
                  {paymentMethod === 'manual' ? 'Bank Transfer' : ''}
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  <strong>Uploaded File:</strong> {paymentProof?.name ?? '–'}
                </p>
              </div>
            </div>

            {/* Bank instructions */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Bank Transfer Details</h3>
              <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
                <li>Account Name: TTS Platform Ltd</li>
                <li>Account Number: 1234567890</li>
                <li>Bank Name: Example Bank</li>
                <li>Routing Number: 123456789</li>
                <li>SWIFT Code: EXAMPLEXXX</li>
                <li>
                  Transfer exactly: $
                  {(
                    plans.find((p) => p._id === selectedPlanId)?.price ?? 0
                  ).toFixed(2)}
                </li>
                <li>Include your Subscription ID as reference</li>
              </ul>
            </div>

            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={goToStep2}>
                ← Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Confirm & Submit
              </Button>
            </div>
          </Card>
        )}

        {/* ─── AFTER SUBMIT: PENDING STATE ──────────────────────────────────────── */}
        {subscription && subscription.status === 'pending' && (
          <Card className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400">
            <h2 className="mb-3 text-lg font-semibold text-yellow-800">
              Subscription Pending
            </h2>
            <p className="text-yellow-700">
              Your payment proof was submitted successfully. We are awaiting admin approval.
              You will be notified when your subscription becomes active.
            </p>
          </Card>
        )}
      </div>
    </>
  )
}
