"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  XCircle, 
  RefreshCw, 
  CreditCard, 
  AlertTriangle, 
  HelpCircle,
  ArrowLeft,
  Mail,
  Phone,
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'

export default function PaymentFailurePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    // Get error details from URL parameters
    setErrorCode(searchParams.get('error') || 'unknown')
    setSessionId(searchParams.get('session_id'))
  }, [searchParams])

  const getErrorMessage = (code: string) => {
    switch (code) {
      case 'card_declined':
        return 'Your card was declined. Please check your card details or try a different payment method.'
      case 'insufficient_funds':
        return 'Your card has insufficient funds. Please try a different payment method.'
      case 'expired_card':
        return 'Your card has expired. Please update your payment information.'
      case 'incorrect_cvc':
        return 'The security code (CVC) you entered is incorrect.'
      case 'processing_error':
        return 'There was an error processing your payment. Please try again.'
      case 'network_error':
        return 'There was a network connection issue. Please check your internet and try again.'
      default:
        return 'An unexpected error occurred during payment processing.'
    }
  }

  const troubleshootingTips = [
    'Verify your card details are correct (number, expiry, CVC)',
    'Ensure you have sufficient funds in your account',
    'Check if your card supports online transactions',
    'Try using a different payment method',
    'Contact your bank if the issue persists'
  ]

  const handleRetryPayment = () => {
    router.push('/pricing')
  }

  const handleContactSupport = () => {
    // You can implement your support contact method here
    window.location.href = 'mailto:support@hirehack.com?subject=Payment Issue&body=Session ID: ' + sessionId
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-2xl border border-gray-700 p-8 md:p-12 text-center"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <XCircle className="w-12 h-12 text-red-500" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-red-400"
          >
            Payment Failed
          </motion.h1>

          {/* Error Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-lg mb-8"
          >
            {getErrorMessage(errorCode || 'unknown')}
          </motion.p>

          {/* Session ID (if available) */}
          {sessionId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-700/50 rounded-lg p-4 mb-8"
            >
              <p className="text-sm text-gray-400">
                Transaction ID: <span className="text-emerald-400 font-mono">{sessionId}</span>
              </p>
            </motion.div>
          )}

          {/* Troubleshooting Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-700/30 rounded-xl p-6 mb-8 text-left"
          >
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-semibold text-yellow-400">Troubleshooting Tips</h3>
            </div>
            <ul className="space-y-2">
              {troubleshootingTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <button
              onClick={handleRetryPayment}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={handleContactSupport}
              className="px-8 py-3 rounded-lg border border-gray-600 hover:border-gray-500 hover:bg-gray-700/50 transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </button>
          </motion.div>

          {/* Support Options */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="border-t border-gray-700 pt-8"
          >
            <h4 className="text-lg font-semibold mb-4 text-gray-300">Need Help?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="mailto:support@hirehack.com"
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-all group"
              >
                <Mail className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-gray-300">Email Support</span>
                <span className="text-xs text-gray-500">support@hirehack.com</span>
              </a>
              <a
                href="tel:+1-555-0123"
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-all group"
              >
                <Phone className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-gray-300">Phone Support</span>
                <span className="text-xs text-gray-500">+1 (555) 0123</span>
              </a>
              <Link
                href="/support"
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-all group"
              >
                <MessageCircle className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-gray-300">Live Chat</span>
                <span className="text-xs text-gray-500">24/7 Available</span>
              </Link>
            </div>
          </motion.div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </motion.div>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-400 font-medium">Important</span>
            </div>
            <p className="text-sm text-gray-300">
              Your account remains active. No charges were processed due to the payment failure. 
              You can retry payment at any time to continue with your subscription.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}