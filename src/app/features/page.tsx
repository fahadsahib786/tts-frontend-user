'use client'

import { motion } from 'framer-motion'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { FaMicrophone, FaLanguage, FaCloud, FaRobot, FaCode, FaChartLine, FaShieldAlt, FaMagic } from 'react-icons/fa'

const features = [
  {
    icon: <FaMicrophone className="w-8 h-8 text-indigo-600" />,
    title: "Natural Voice Quality",
    description: "Experience human-like speech with proper intonation, emphasis, and emotional expression."
  },
  {
    icon: <FaLanguage className="w-8 h-8 text-indigo-600" />,
    title: "Multiple Languages",
    description: "Support for 30+ languages and various regional accents to reach a global audience."
  },
  {
    icon: <FaCloud className="w-8 h-8 text-indigo-600" />,
    title: "Cloud Processing",
    description: "Fast, scalable cloud infrastructure ensuring quick processing of any volume of text."
  },
  {
    icon: <FaRobot className="w-8 h-8 text-indigo-600" />,
    title: "AI-Powered",
    description: "Advanced neural networks delivering consistently high-quality voice synthesis."
  },
  {
    icon: <FaCode className="w-8 h-8 text-indigo-600" />,
    title: "API Access",
    description: "RESTful API integration for seamless incorporation into your applications."
  },
  {
    icon: <FaChartLine className="w-8 h-8 text-indigo-600" />,
    title: "Usage Analytics",
    description: "Detailed insights into your text-to-speech usage and performance metrics."
  },
  {
    icon: <FaShieldAlt className="w-8 h-8 text-indigo-600" />,
    title: "Enterprise Security",
    description: "Bank-level encryption and data protection for your content and audio files."
  },
  {
    icon: <FaMagic className="w-8 h-8 text-indigo-600" />,
    title: "Voice Customization",
    description: "Create and customize voices to match your brand's unique identity."
  }
]

const useCases = [
  {
    title: "Content Creators",
    description: "Create engaging audio content for videos, podcasts, and social media.",
    benefits: ["Automated voiceovers", "Consistent quality", "Time-saving"]
  },
  {
    title: "E-Learning",
    description: "Transform educational content into accessible audio materials.",
    benefits: ["Multiple languages", "Natural pronunciation", "Scalable solution"]
  },
  {
    title: "Business",
    description: "Professional voice solutions for announcements and customer service.",
    benefits: ["Brand voice", "Multi-channel support", "Cost-effective"]
  },
  {
    title: "Accessibility",
    description: "Make your content accessible to visually impaired users.",
    benefits: ["WCAG compliance", "Screen reader support", "Universal access"]
  }
]

export default function FeaturesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-indigo-50 to-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Powerful Features for Professional Voice Generation
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Discover why thousands of professionals choose our platform for their text-to-speech needs.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Features */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">Technical Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4">API Integration</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                      RESTful API endpoints
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                      WebSocket support for real-time processing
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                      Comprehensive API documentation
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4">Voice Customization</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                      Custom voice creation
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                      Pitch and speed control
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                      Emotion and emphasis adjustment
                    </li>
                  </ul>
                </div>
              </motion.div>
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4">Security & Compliance</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                      End-to-end encryption
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                      GDPR compliance
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                      SOC 2 certification
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4">Performance</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                      99.9% uptime guarantee
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                      Global CDN distribution
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                      Auto-scaling infrastructure
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-xl font-bold mb-4">{useCase.title}</h3>
                  <p className="text-gray-600 mb-4">{useCase.description}</p>
                  <ul className="space-y-2">
                    {useCase.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-gray-600">
                        <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Transform Your Content?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Start creating professional voice content today with our advanced text-to-speech platform.
            </p>
            <motion.div
              className="flex justify-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <button
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
                onClick={() => window.location.href = '/register'}
              >
                Get Started Free
              </button>
              <button
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Sales
              </button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
