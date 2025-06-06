"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ShieldAlert } from "lucide-react"

interface TrialStatusBannerProps {
  subscription_status: "free_trial" | "active" | "inactive"
}

export default function TrialStatusBanner({ subscription_status }: TrialStatusBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3">
        <ShieldAlert className="w-6 h-6 text-purple-400" />
        <div>
          <h3 className="font-semibold">
            {subscription_status === "free_trial"
              ? "Free Trial: Quiz feature not included"
              : "Premium Member: Unlimited Quizzes"}
          </h3>
          {subscription_status === "free_trial" && (
            <Link
              href="/pricing"
              className="text-sm text-purple-300 hover:underline mt-1 inline-block transition-colors duration-200 ease-in-out"
            >
              Upgrade to Unlock Quizzes →
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
