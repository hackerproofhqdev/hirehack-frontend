import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Feature {
    title: string;
    description: string;
    icon: React.ReactNode;
    link: string;
  }
  
  interface FeatureCardProps {
    feature: Feature;
    index: number;
  }
  
export const FeatureCard = ({ feature, index }: FeatureCardProps) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5 }}
      >
        <Link href={feature.link}>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
            <div className="relative p-6 bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/80 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gray-800/80 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-100 group-hover:text-emerald-400 transition-colors">
                  {feature.title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };