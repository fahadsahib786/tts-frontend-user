'use client'

import { useRouter } from 'next/navigation'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  FaMicrophone,
  FaRobot,
  FaCloud,
  FaLaptop,
  FaMobile,
  FaTablet,
  FaHeadphones,
} from 'react-icons/fa'

export default function HomePage() {
  const router = useRouter()

  // We removed any localStorage check—Providers already did it.
  // So this page simply renders the marketing sections.

  // Scroll to section handler (unchanged)
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section
          id="hero"
          className="bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-500 text-white pt-32 pb-24 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="max-w-3xl md:w-1/2">
                <motion.h1
                  className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Transform Text into Natural Speech with AI
                </motion.h1>
                <motion.p
                  className="text-xl md:text-2xl mb-8 text-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Create human-like voices for your content using cutting-edge AI
                  technology. Perfect for podcasts, videos, and accessibility.
                </motion.p>
                <motion.div
                  className="space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <button
                    onClick={() => router.push('/register')}
                    className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-indigo-50 transition transform hover:scale-105"
                  >
                    Start Free Trial
                  </button>
                  <button
                    onClick={() => router.push('/demo')}
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition transform hover:scale-105"
                  >
                    Try Demo
                  </button>
                </motion.div>
                <motion.div
                  className="mt-8 flex items-center space-x-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <button
                    onClick={() => scrollToSection('features')}
                    className="text-white flex items-center space-x-2 hover:text-gray-200 transition"
                  >
                    <span>Learn More</span>
                    <svg
                      className="w-5 h-5 animate-bounce"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </button>
                </motion.div>
              </div>
              <motion.div
                className="hidden md:block md:w-1/2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative h-[400px] w-full">
                  <Image
                    src="/hero-illustration.svg"
                    alt="AI Voice Generation Illustration"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </div>
          {/* Background Animation */}
          <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
            <div className="absolute w-96 h-96 -top-10 -right-10 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute w-96 h-96 -bottom-10 -left-10 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Why Choose Our Platform?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaMicrophone className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Natural Voice Quality</h3>
                <p className="text-gray-600">
                  State-of-the-art AI technology delivering human-like speech with
                  proper intonation and emphasis.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaRobot className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Advanced AI Engine</h3>
                <p className="text-gray-600">
                  Powered by cutting-edge machine learning models for the most
                  natural-sounding voice synthesis.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCloud className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Cloud Processing</h3>
                <p className="text-gray-600">
                  Fast, scalable cloud processing for quick conversions no matter your
                  volume needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Choose Your Perfect Plan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Basic Plan */}
              <div className="p-8 hover:shadow-lg transition-shadow bg-white rounded-lg">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Basic</h3>
                  <div className="text-gray-500 mb-4">For Personal Use</div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$9</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8 text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    100,000 characters per month
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    1GB storage
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    5 voice options
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Standard support
                  </li>
                </ul>
                <button
                  onClick={() => router.push('/dashboard/subscription')}
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Select Basic
                </button>
              </div>

              {/* Pro Plan */}
              <div className="p-8 border-2 border-indigo-500 relative hover:shadow-lg transition-shadow bg-white rounded-lg">
                <div className="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 text-sm font-semibold rounded-bl">
                  Popular
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <div className="text-gray-500 mb-4">For Professional Use</div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$29</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8 text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    500,000 characters per month
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    5GB storage
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    15 voice options
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    API access
                  </li>
                </ul>
                <button
                  onClick={() => router.push('/dashboard/subscription')}
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Select Pro
                </button>
              </div>

              {/* Enterprise Plan */}
              <div className="p-8 hover:shadow-lg transition-shadow bg-white rounded-lg">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                  <div className="text-gray-500 mb-4">For Large Teams</div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$99</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8 text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Unlimited characters
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    20GB storage
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    All voice options
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    24/7 priority support
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Custom voice creation
                  </li>
                </ul>
                <button
                  onClick={() => router.push('/dashboard/subscription')}
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Select Enterprise
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-Platform Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Available on All Devices
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <FaLaptop className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
                <h3 className="font-semibold">Desktop</h3>
              </div>
              <div>
                <FaMobile className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
                <h3 className="font-semibold">Mobile</h3>
              </div>
              <div>
                <FaTablet className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
                <h3 className="font-semibold">Tablet</h3>
              </div>
              <div>
                <FaHeadphones className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
                <h3 className="font-semibold">Smart Devices</h3>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-gray-100 max-w-2xl mx-auto">
              Join thousands of content creators who are already using our platform
              to create engaging audio content.
            </p>
            <button
              onClick={() => router.push('/register')}
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              Start Your Free Trial
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
