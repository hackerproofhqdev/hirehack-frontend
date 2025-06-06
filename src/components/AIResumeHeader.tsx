"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, LogOut, Menu, X } from 'lucide-react'
import Link from "next/link"
import { logout } from "@/actions/logout"

export default function AIResumeHeader() {
  const [isNavOpen, setIsNavOpen] = useState(false)

  return (
    <header className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700 relative">
      <Link href={'/dashboard'}>
        <div className="text-xl flex gap-2 items-center font-bold text-teal-400">
          <Brain className="w-6 h-6" />
          HireHack
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-4">
        <Link
          href={"/dashboard/resumeAnalysis"}
          className="px-2 py-1 hover:bg-gray-700 rounded-lg transition-colors"
        >
          Resume Analyzer
        </Link>
        <Link
          href={"/dashboard/jobSearch"}
          className="px-2 py-1 hover:bg-gray-700 rounded-lg transition-colors"
        >
          Job Search
        </Link>
        <Link
          href={"/dashboard/interviewprep"}
          className="px-2 py-1 hover:bg-gray-700 rounded-lg transition-colors"
        >
          Interview Prep
        </Link>
        <Link
          href={"/dashboard/quiz"}
          className="px-2 py-1 hover:bg-gray-700 rounded-lg transition-colors"
        >
          Quiz Generation
        </Link>
        <Link
          href={"/dashboard/userProfile"}
          className="px-2 py-1 hover:bg-gray-700 rounded-lg transition-colors"
        >
          User Profile
        </Link>
        <button
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          onClick={() => logout()}
        >
          <LogOut className="w-5 h-5 text-gray-300" />
        </button>
      </div>

      <div className="md:hidden flex items-center">
        <motion.button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {isNavOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isNavOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-gray-800 border-b border-gray-700 z-50 md:hidden"
          >
            <div className="flex flex-col gap-2 p-4">
              <Link
                href={"/dashboard/resumeAnalysis"}
                onClick={() => setIsNavOpen(false)}
                className="px-2 py-1 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Resume Analyzer 
              </Link>
              <Link
                href={"/dashboard/interviewprep"}
                onClick={() => setIsNavOpen(false)}
                className="px-2 py-1 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Interview Prep
              </Link>
              <Link
                href={"/dashboard/quiz"}
                onClick={() => setIsNavOpen(false)}
                className="px-2 py-1 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Quiz Generation
              </Link>
              <Link
                href={"/dashboard/jobSearch"}
                onClick={() => setIsNavOpen(false)}
                className="px-2 py-1 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Job Search
              </Link>
              <Link
                href={"/dashboard/userProfile"}
                onClick={() => setIsNavOpen(false)}
                className="px-2 py-1 hover:bg-gray-700 rounded-lg transition-colors"
              >
                User Profile
              </Link>
              <button
                onClick={() => {
                  setIsNavOpen(false)
                  logout()
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
