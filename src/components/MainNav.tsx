"use client";
import { Brain, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useCookies } from '@/hooks/cookiesHook/useCookies';
import React, { useEffect } from 'react'

export default function Navbar({text = "Login"}:{text:string}) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [token  , setToken] = React.useState()
    const {getCookie} = useCookies()
    useEffect(()=>{
      const checkToken = async () => {
        const accessToken = await getCookie("accessToken")
        setToken(accessToken)
      }
      checkToken()
    },[])
  return (
    <nav className="bg-gray-900/95 border-b border-gray-800 fixed w-full z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={'/'} className="flex items-center">
              <Brain className="h-8 w-8 text-emerald-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text ml-2">
                HireHack
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <Link href="/about" className="px-4 py-2 rounded-lg transition-all hover:bg-gray-800">
                 About Us
                </Link>
                <Link href="/pricing" className="px-4 py-2 rounded-lg transition-all hover:bg-gray-800">
                Pricing
                </Link>
                <Link href="/login" className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all">
                    {token ? "Dashboard" : "Login"}
                 
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-800"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/about" className="block px-4 py-2 rounded-lg hover:bg-gray-800">
               About Us
              </Link>
              <Link href="/complaint" className="block px-4 py-2 rounded-lg hover:bg-gray-800">
              Complaint
              </Link>
              <Link href="/login" className="block px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
              
                  Login
                
              </Link>
            </div>
          </div>
        )}
      </nav>
  )
}
