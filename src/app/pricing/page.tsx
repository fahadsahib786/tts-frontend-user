'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa'
import { Tooltip } from '@/components/ui/tooltip'
import { Switch } from '@/components/ui/switch'
import { motion } from 'framer-motion'

interface Feature {
  name: string
  basic: boolean | string | number
  pro: boolean | string | number
  enterprise: boolean | string | number
  tooltip?: string
}

const features: Feature[] = [
  {
    name: 'Characters per month',
    basic: '100,000',
    pro: '500,000',
    enterprise: 'Unlimited',
    tooltip: 'Number of characters you can convert to speech per month',
  },
  {
    name: 'Storage space',
    basic: '1GB',
    pro: '5GB',
    enterprise: '20GB',
    tooltip: 'Storage space for your generated audio files',
  },
  {
    name: 'Voice options',
    basic: '5',
    pro: '15',
    enterprise: 'All voices',
    tooltip: 'Number of different voice options available',
  },
  {
    name: 'Custom voice creation',
    basic: false,
    pro: false,
    enterprise: true,
    tooltip: 'Create custom voices based on your audio samples',
  },
  {
    name: 'API access',
    basic: false,
    pro: true,
    enterprise: true,
    tooltip: 'Access our API for programmatic text-to-speech conversion',
  },
  {
    name: 'Commercial usage',
    basic: false,
    pro: true,
    enterprise: true,
    tooltip: 'Use generated audio for commercial purposes',
  },
  {
    name: 'Priority support',
    basic: false,
    pro: true,
    enterprise: '24/7 dedicated',
    tooltip: 'Priority access to our support team',
  },
  {
    name: 'Team members',
    basic: '1',
    pro: '5',
    enterprise: 'Unlimited',
    tooltip: 'Number of team members who can access the account',
  },
]

export default function PricingPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [isAnnual, setIsAnnual] = useState(false)

  // Pricing tiers
  const prices = {
    basic: { monthly: 9, annual: 90 },
    pro: { monthly: 29, annual: 290 },
    enterprise: { monthly: 99, annual: 990 },
  }

  /**
   * When user clicks a plan button, send them to /dashboard/subscription.
   * If they’re not logged in, the SubscriptionLayout will redirect to /login,
   * then bring them back to /dashboard/subscription once they sign in.
   */
  const handlePlanSelection = (planId: 'basic' | 'pro' | 'enterprise') => {
    if (!isAuthenticated) {
      // Save intended path, then send to /login
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', '/dashboard/subscription')
      }
      router.push('/login')
    } else {
      router.push('/dashboard/subscription')
    }
  }

  // Framer‐motion fade-in config
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your needs. All plans include our core
              features with different usage limits.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mt-8 space-x-4">
              <span className={`text-lg ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly billing
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-indigo-600"
              />
              <span className={`text-lg ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                Annual billing
                <span className="ml-2 text-sm text-indigo-600 font-medium">Save 20%</span>
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Basic Plan */}
            <motion.div
              {...fadeInUp}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Basic</h3>
                <p className="text-gray-500 mb-4">For personal projects</p>
                <div className="text-4xl font-bold">
                  ${isAnnual ? prices.basic.annual : prices.basic.monthly}
                  <span className="text-lg text-gray-500 font-normal">
                    /{isAnnual ? 'year' : 'month'}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => handlePlanSelection('basic')}
                className="w-full mb-8 bg-indigo-600 hover:bg-indigo-700"
              >
                {isAuthenticated ? 'Select Plan' : 'Get Started'}
              </Button>
              <ul className="space-y-4">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    {typeof feature.basic === 'boolean' ? (
                      feature.basic ? (
                        <FaCheck className="text-green-500 mr-2" />
                      ) : (
                        <FaTimes className="text-red-500 mr-2" />
                      )
                    ) : (
                      <span className="text-green-500 mr-2">✓</span>
                    )}
                    <span className="flex-1">{feature.name}</span>
                    {feature.tooltip && (
                      <Tooltip content={feature.tooltip}>
                        <FaInfoCircle className="text-gray-400 ml-2" />
                      </Tooltip>
                    )}
                    {typeof feature.basic !== 'boolean' && (
                      <span className="ml-2 text-gray-600">{feature.basic}</span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              {...fadeInUp}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-indigo-500 relative"
            >
              <div className="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 text-sm font-semibold rounded-bl">
                Popular
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-gray-500 mb-4">For professionals</p>
                <div className="text-4xl font-bold">
                  ${isAnnual ? prices.pro.annual : prices.pro.monthly}
                  <span className="text-lg text-gray-500 font-normal">
                    /{isAnnual ? 'year' : 'month'}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => handlePlanSelection('pro')}
                className="w-full mb-8 bg-indigo-600 hover:bg-indigo-700"
              >
                {isAuthenticated ? 'Select Plan' : 'Get Started'}
              </Button>
              <ul className="space-y-4">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    {typeof feature.pro === 'boolean' ? (
                      feature.pro ? (
                        <FaCheck className="text-green-500 mr-2" />
                      ) : (
                        <FaTimes className="text-red-500 mr-2" />
                      )
                    ) : (
                      <span className="text-green-500 mr-2">✓</span>
                    )}
                    <span className="flex-1">{feature.name}</span>
                    {feature.tooltip && (
                      <Tooltip content={feature.tooltip}>
                        <FaInfoCircle className="text-gray-400 ml-2" />
                      </Tooltip>
                    )}
                    {typeof feature.pro !== 'boolean' && (
                      <span className="ml-2 text-gray-600">{feature.pro}</span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              {...fadeInUp}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <p className="text-gray-500 mb-4">For large teams</p>
                <div className="text-4xl font-bold">
                  ${isAnnual ? prices.enterprise.annual : prices.enterprise.monthly}
                  <span className="text-lg text-gray-500 font-normal">
                    /{isAnnual ? 'year' : 'month'}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => handlePlanSelection('enterprise')}
                className="w-full mb-8 bg-indigo-600 hover:bg-indigo-700"
              >
                Contact Sales
              </Button>
              <ul className="space-y-4">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    {typeof feature.enterprise === 'boolean' ? (
                      feature.enterprise ? (
                        <FaCheck className="text-green-500 mr-2" />
                      ) : (
                        <FaTimes className="text-red-500 mr-2" />
                      )
                    ) : (
                      <span className="text-green-500 mr-2">✓</span>
                    )}
                    <span className="flex-1">{feature.name}</span>
                    {feature.tooltip && (
                      <Tooltip content={feature.tooltip}>
                        <FaInfoCircle className="text-gray-400 ml-2" />
                      </Tooltip>
                    )}
                    {typeof feature.enterprise !== 'boolean' && (
                      <span className="ml-2 text-gray-600">{feature.enterprise}</span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <section className="py-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">
                  We accept all major credit cards, PayPal, and bank transfers for annual plans.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Can I change my plan later?
                </h3>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of the next billing cycle.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  What happens if I exceed my monthly limit?
                </h3>
                <p className="text-gray-600">
                  You&apos;ll receive a notification when you&apos;re close to your limit. You can either upgrade your plan or purchase additional credits.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Do you offer refunds?</h3>
                <p className="text-gray-600">
                  Yes, we offer a 30-day money-back guarantee for all plans. No questions asked.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center py-16">
            <h2 className="text-3xl font-bold mb-6">Still have questions?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Our team is here to help you find the perfect plan for your needs.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push('/contact')}
                className="px-8"
              >
                Contact Sales
              </Button>
              <Button
                onClick={() => router.push('/demo')}
                className="px-8 bg-indigo-600 hover:bg-indigo-700"
              >
                Try Demo
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
