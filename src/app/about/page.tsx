'use client'

import Image from 'next/image'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { motion } from 'framer-motion'
import { FaRocket, FaUsers, FaMicrochip, FaGlobe } from 'react-icons/fa'

const stats = [
  { number: '10M+', label: 'Characters Processed Daily' },
  { number: '50K+', label: 'Active Users' },
  { number: '100+', label: 'Countries Served' },
  { number: '99.9%', label: 'Uptime' }
]

const values = [
  {
    icon: <FaRocket className="w-8 h-8 text-indigo-600" />,
    title: 'Innovation',
    description: 'Pushing the boundaries of what\'s possible in speech synthesis technology.'
  },
  {
    icon: <FaUsers className="w-8 h-8 text-indigo-600" />,
    title: 'User-Centric',
    description: 'Every feature we develop is designed with our users\' needs in mind.'
  },
  {
    icon: <FaMicrochip className="w-8 h-8 text-indigo-600" />,
    title: 'Technical Excellence',
    description: 'Committed to delivering the highest quality voice generation technology.'
  },
  {
    icon: <FaGlobe className="w-8 h-8 text-indigo-600" />,
    title: 'Global Impact',
    description: 'Making voice technology accessible to users worldwide.'
  }
]

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function AboutPage() {
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
                Revolutionizing Text-to-Speech Technology
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                We're on a mission to make natural-sounding voice generation accessible to everyone, 
                empowering creators and businesses to connect with their audience in new ways.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  Founded in 2020, VoiceAI emerged from a simple observation: the gap between 
                  artificial and human speech was too wide. Our team of AI researchers and 
                  speech experts set out to bridge this gap.
                </p>
                <p className="text-gray-600 mb-4">
                  Through years of research and development, we've created a revolutionary 
                  text-to-speech engine that produces incredibly natural-sounding voices. 
                  Today, we're proud to serve creators, businesses, and developers worldwide.
                </p>
                <p className="text-gray-600">
                  Our commitment to innovation continues as we push the boundaries of what's 
                  possible in voice synthesis technology.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="relative h-[400px]"
              >
                <Image
                  src="/about-image.jpg"
                  alt="VoiceAI team at work"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Our Leadership Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((member, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative w-48 h-48 mx-auto mb-4">
                    <Image
                      src={`/team-member-${member}.jpg`}
                      alt="Team member"
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-1">John Doe</h3>
                  <p className="text-gray-600 mb-2">Chief Executive Officer</p>
                  <p className="text-gray-500 text-sm">
                    15+ years experience in AI and machine learning
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-indigo-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">Join Us in Shaping the Future of Voice Technology</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Whether you're a creator, business owner, or developer, we invite you to experience 
              the next generation of text-to-speech technology.
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
                Get Started
              </button>
              <button
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Us
              </button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
