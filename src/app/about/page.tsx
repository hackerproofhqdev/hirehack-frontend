"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Sparkles, Target, Lock, ChevronRight } from 'lucide-react';
import Navbar from '@/components/MainNav';
import { useRouter } from 'next/navigation';

const AboutUs = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };
  const {push} = useRouter()
  return (
    <div className="min-h-screen bg-gray-900 text-white">
            <Navbar text="Login"/>
      {/* Hero Section */}
      <motion.section 
        className="relative pt-20 pb-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h1 
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent"
            {...fadeIn}
          >
            Revolutionizing Job Search with AI
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl"
            {...fadeIn}
          >
            We're on a mission to transform how people find their dream jobs using cutting-edge artificial intelligence and machine learning.
          </motion.p>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section 
        className="py-16 px-4 bg-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2 
                className="text-3xl font-bold mb-6 text-emerald-400"
                {...fadeIn}
              >
                Our Mission
              </motion.h2>
              <motion.p 
                className="text-gray-300 mb-4"
                {...fadeIn}
              >
                At  Hire Hack, we believe everyone deserves the perfect career opportunity. Our AI-powered platform analyzes millions of data points to match candidates with their ideal positions, while providing personalized insights to improve their applications.
              </motion.p>
            </div>
            <motion.div 
              className="grid grid-cols-2 gap-6"
              variants={{
                initial: { opacity: 0 },
                animate: { opacity: 1, transition: { staggerChildren: 0.2 } }
              }}
              initial="initial"
              animate="animate"
            >
              {[
                { icon: Users, title: "Smart Matching", desc: "AI-powered job recommendations" },
                { icon: Sparkles, title: "Resume Analysis", desc: "Intelligent resume optimization" },
                { icon: Target, title: "Career Insights", desc: "Data-driven career guidance" },
                { icon: Lock, title: "Secure Platform", desc: "Enterprise-grade security" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="p-6 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  variants={fadeIn}
                >
                  <item.icon className="w-8 h-8 text-emerald-400 mb-4" />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-300">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section 
        className="py-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center text-emerald-400"
            {...fadeIn}
          >
            Our Team
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { role: "AI Engineers", desc: "Building cutting-edge algorithms" },
              { role: "Career Experts", desc: "Providing industry insights" },
              { role: "Support Team", desc: "24/7 dedicated assistance" }
            ].map((member, index) => (
              <motion.div 
                key={index}
                className="p-6 rounded-lg bg-gray-800 border border-gray-700 hover:border-emerald-400 transition-colors"
                variants={fadeIn}
              >
                <h3 className="text-xl font-semibold mb-3">{member.role}</h3>
                <p className="text-gray-300">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 px-4 bg-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold mb-6 text-emerald-400"
            {...fadeIn}
          >
            Ready to Transform Your Job Search?
          </motion.h2>
          <motion.button 
            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold flex items-center mx-auto gap-2 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => push('/register')}
          >
            Get Started Today
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUs;