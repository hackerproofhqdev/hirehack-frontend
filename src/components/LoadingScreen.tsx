"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <Loader2 className="w-16 h-16 animate-spin mx-auto text-teal-500" />
        <h2 className="text-3xl font-semibold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
          Crafting Your Quiz
        </h2>
        <p className="text-gray-400 text-lg">
          Analyzing job requirements and generating relevant questions
        </p>
      </motion.div>
    </div>
  )
}
