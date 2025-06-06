'use client'

import Link from 'next/link'
import { FaTwitter, FaFacebook, FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">VoiceAI</h3>
            <p className="text-gray-400">
              Transform your text into natural-sounding speech with our advanced AI technology.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FaGithub className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="hover:text-white">Features</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white">Pricing</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">About Us</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">Blog</Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white">Careers</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="hover:text-white">Help Center</Link>
              </li>
              <li>
                <Link href="/documentation" className="hover:text-white">Documentation</Link>
              </li>
              <li>
                <Link href="/api" className="hover:text-white">API Reference</Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-white">System Status</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="h-6 w-6 text-indigo-500 flex-shrink-0" />
                <span>
                  123 AI Street<br />
                  Tech Valley, CA 94043<br />
                  United States
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="h-5 w-5 text-indigo-500" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="h-5 w-5 text-indigo-500" />
                <span>support@voiceai.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © {currentYear} VoiceAI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="text-sm hover:text-white">Terms of Service</Link>
              <Link href="/cookies" className="text-sm hover:text-white">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
