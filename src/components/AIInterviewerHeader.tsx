import { logout } from '@/actions/logout';
import { Brain, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

interface AIInterviewerHeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export default function AIInterviewerHeader({ isMenuOpen, setIsMenuOpen }: AIInterviewerHeaderProps) {
  return (
     <header className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <Link href={'/dashboard'} className="text-xl flex gap-2 items-center font-bold text-teal-400">
            <Brain className="w-6 h-6" />
            HireHack
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard/resumeAnalysis" className="p-2 hover:bg-gray-700 rounded-lg transition-colors px-2 py-1">
              Resume Analyzer
            </Link>

            <Link href="/dashboard/quiz" className="p-2 hover:bg-gray-700 rounded-lg transition-colors px-2 py-1">
              Quiz Generation
            </Link>
            <Link href="/dashboard/userProfile" className="p-2 hover:bg-gray-700 rounded-lg transition-colors px-2 py-1">
              User profile
            </Link>
            <button
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              onClick={() => logout()}
            >
              <LogOut className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-2">
            <Link
              href="/dashboard/resumeAnalysis"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Resume Analyzer
            </Link>

            <Link
              href="/dashboard/quiz"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Quiz Generation
            </Link>
            <Link
              href="/dashboard/userProfile"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              User Profile
            </Link>
            <button
              className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
              onClick={() => {
                setIsMenuOpen(false);
                logout();
              }}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </header>
  )
}
