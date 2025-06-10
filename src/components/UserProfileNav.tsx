import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Menu, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { logout } from '@/actions/logout';

const Navbar = ({ text }:{text:string}) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    logout()
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title Section */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Brain className="w-8 h-8 text-emerald-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-transparent bg-clip-text">
                HireHack
              </span>
            </Link>
            <div className="h-6 w-px bg-gray-600"></div>
            <h1 className="text-lg font-semibold text-white">{text}</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push('/dashboard/resumeAnalysis')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Resume Analyzer
            </button>
            <button
              onClick={() => router.push('/dashboard/jobSearch')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Job Search
            </button>
            <button
              onClick={() => router.push('/dashboard/interviewprep')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Interview Prep
            </button>
            <button
              onClick={() => router.push('/dashboard/quiz')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Quiz Generation
            </button>
            <button
              onClick={() => router.push('/dashboard/saveResume')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Resumes
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 space-y-2"
          >
            <button
              onClick={() => {
                router.push('/dashboard');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                router.push('/dashboard/saveResume');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              Resumes
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;