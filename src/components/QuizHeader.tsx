"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Brain, LogOut } from "lucide-react"

interface QuizHeaderProps {
  onLogout: () => void
}

export default function QuizHeader({ onLogout }: QuizHeaderProps) {
  return (
    <header className="bg-gray-800/50 p-4 flex flex-col sm:flex-row items-center justify-between mb-6 rounded-lg backdrop-blur-sm">
      <Link href={'/dashboard'}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 text-2xl font-bold mb-4 sm:mb-0"
      >
        <Brain className="text-teal-400" />
        <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
          HireHack
        </span>
      </motion.div>
      </Link>

      <div className="flex flex-wrap items-center gap-4 justify-center sm:justify-end">
        <Button variant="ghost" className="text-gray-300 hover:bg-gray-700/50" asChild>
          <Link href="/dashboard/resumeAnalysis">Resume Analyzer</Link>
        </Button>

        <Button variant="ghost" className="text-gray-300 hover:bg-gray-700/50" asChild>
          <Link href="/dashboard/interviewprep">Interview Prep</Link>
        </Button>
        <Button variant="ghost" className="text-gray-300 hover:bg-gray-700/50" asChild>
          <Link href="/dashboard/userProfile">User Profile</Link>
        </Button>
        <Button
          variant="ghost"
          className="text-red-300 hover:bg-red-500/20 transition-colors duration-200"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </Button>
      </div>
    </header>
  )
}
