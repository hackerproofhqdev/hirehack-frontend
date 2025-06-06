import { logout } from "@/actions/logout";
import { motion } from "framer-motion";
import { BrainIcon, LogOut, User2 } from "lucide-react";
import Link from "next/link";

export const DashboardNavbar = () => {
    return (
      <nav className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-2xl flex justify-center items-center gap-2 font-bold">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-gray-800/50 p-2 rounded-xl border border-gray-700"
              >
                <BrainIcon className="w-8 h-8 text-emerald-400" />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-transparent bg-clip-text font-bold">
                  HireHack
                </span>
              </motion.div>
            </Link>
  
            <div className="flex items-center space-x-6">
  
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  href="/dashboard/userProfile"
                  className="p-2 transition-colors group"
                >
                  <User2 className="w-5 h-5 text-gray-300 group-hover:text-emerald-400 transition-colors" />
                </Link>
              </motion.div>
  
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => logout()}
                className="p-2 hover:bg-gray-800 rounded-xl transition-colors group"
              >
                <LogOut className="w-5 h-5 text-gray-300 group-hover:text-emerald-400 transition-colors" />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>
    );
  };
  