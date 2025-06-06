"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ScrollText, Shield, Users, AlertCircle, Scale, Key, Clock, HelpCircle } from 'lucide-react';

const TermsAndConditions = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const TermsSection = ({ icon: Icon, title, children }:any) => (
    <motion.section 
      className="mb-12"
      variants={fadeIn}
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-6 h-6 text-emerald-400" />
        <h2 className="text-2xl font-bold text-emerald-400">{title}</h2>
      </div>
      <div className="prose prose-invert max-w-none">
        {children}
      </div>
    </motion.section>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.h1 
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent"
            {...fadeIn}
          >
            Terms and Conditions
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300"
            {...fadeIn}
          >
            Last updated: November 4, 2024
          </motion.p>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div 
          className="grid md:grid-cols-3 gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { icon: ScrollText, title: "Agreement" },
            { icon: Users, title: "User Obligations" },
            { icon: Shield, title: "Privacy" },
            { icon: Scale, title: "Liability" },
            { icon: Key, title: "Account Terms" },
            { icon: Clock, title: "Duration" }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-emerald-400 transition-colors cursor-pointer"
              whileHover={{ scale: 1.02 }}
              {...fadeIn}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-emerald-400" />
                <span className="font-medium">{item.title}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Agreement */}
        <TermsSection icon={ScrollText} title="Agreement to Terms">
          <p className="text-gray-300 mb-4">
            By accessing or using Hire Hack, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you disagree with any part of these terms, you may not access the service.
          </p>
        </TermsSection>

        {/* Account Terms */}
        <TermsSection icon={Key} title="Account Terms">
          <div className="space-y-4 text-gray-300">
            <p>When creating an account, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Promptly update your account information</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Not share your account with third parties</li>
            </ul>
          </div>
        </TermsSection>

        {/* User Obligations */}
        <TermsSection icon={Users} title="User Obligations">
          <div className="space-y-4 text-gray-300">
            <h3 className="text-xl font-semibold text-white">Acceptable Use:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the service legally and ethically</li>
              <li>Respect intellectual property rights</li>
              <li>Maintain accurate profile information</li>
              <li>Not engage in fraudulent activities</li>
              <li>Not interfere with service operations</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6">Prohibited Activities:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Creating false or misleading content</li>
              <li>Attempting to bypass security measures</li>
              <li>Spreading malware or harmful code</li>
              <li>Harassing other users</li>
            </ul>
          </div>
        </TermsSection>

        {/* Service Terms */}
        <TermsSection icon={AlertCircle} title="Service Terms">
          <div className="space-y-4 text-gray-300">
            <p>Our service terms include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Right to modify or discontinue services</li>
              <li>No guarantee of job placement</li>
              <li>Service availability and maintenance</li>
              <li>Data processing and AI algorithm usage</li>
              <li>Third-party integration terms</li>
            </ul>
          </div>
        </TermsSection>

        {/* Intellectual Property */}
        <TermsSection icon={Shield} title="Intellectual Property">
          <div className="space-y-4 text-gray-300">
            <p>Ownership and rights regarding:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Platform content and features</li>
              <li>User-submitted content</li>
              <li>AI-generated content</li>
              <li>Trademarks and branding</li>
              <li>Platform technology and algorithms</li>
            </ul>
          </div>
        </TermsSection>

        {/* Liability */}
        <TermsSection icon={Scale} title="Limitation of Liability">
          <div className="space-y-4 text-gray-300">
            <p>Hire Hack Helper's liability is limited regarding:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service interruptions</li>
              <li>Data accuracy</li>
              <li>Third-party actions</li>
              <li>Employment outcomes</li>
              <li>Indirect damages</li>
            </ul>
          </div>
        </TermsSection>

        {/* Duration and Termination */}
        <TermsSection icon={Clock} title="Duration and Termination">
          <div className="space-y-4 text-gray-300">
            <p>Terms regarding service duration and termination:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account termination conditions</li>
              <li>Service discontinuation rights</li>
              <li>Data retention after termination</li>
              <li>Refund policies</li>
            </ul>
          </div>
        </TermsSection>

        {/* Changes to Terms */}
        <TermsSection icon={HelpCircle} title="Changes to Terms">
          <p className="text-gray-300">
            We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the platform. Continued use of the service after changes constitutes acceptance of the modified terms.
          </p>
        </TermsSection>

        {/* Contact Section */}
        <motion.section 
          className="mt-16 p-6 bg-gray-800 rounded-lg border border-gray-700"
          {...fadeIn}
        >
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">Contact Information</h2>
          <p className="text-gray-300 mb-4">
            For questions about these Terms and Conditions, please contact us:
          </p>
          <ul className="space-y-2 text-gray-300">
            <li>Email: info@hackerproofhq.com</li>
            <li>Phone: 3213250955</li>
            <li>Address: 123 AI Street, Tech Valley, CA 94025</li>
          </ul>
        </motion.section>
      </div>
    </div>
  );
};

export default TermsAndConditions;