"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Globe, Bell, FileText, Settings } from 'lucide-react';

const PrivacyPolicy = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const PolicySection = ({ icon: Icon, title, children }:any) => (
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
            Privacy Policy
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
          className="grid md:grid-cols-2 gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { icon: Shield, title: "Data Protection" },
            { icon: Database, title: "Information Collection" },
            { icon: Globe, title: "Data Sharing" },
            { icon: Settings, title: "Your Choices" }
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

        {/* Introduction */}
        <PolicySection icon={FileText} title="Introduction">
          <p className="text-gray-300 mb-4">
            At Hire Hack, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. Please read this privacy policy carefully. By using our service, you consent to the practices described in this policy.
          </p>
        </PolicySection>

        {/* Information Collection */}
        <PolicySection icon={Database} title="Information We Collect">
          <div className="space-y-4 text-gray-300">
            <h3 className="text-xl font-semibold text-white">Personal Information:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name and contact information</li>
              <li>Resume and professional history</li>
              <li>Employment preferences</li>
              <li>Account credentials</li>
              <li>Communication history</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6">Technical Information:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type and settings</li>
              <li>Usage patterns and preferences</li>
              <li>Cookies and similar technologies</li>
            </ul>
          </div>
        </PolicySection>

        {/* How We Use Information */}
        <PolicySection icon={Settings} title="How We Use Your Information">
          <div className="space-y-4 text-gray-300">
            <p>We use the collected information for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing personalized job recommendations</li>
              <li>Improving our AI algorithms</li>
              <li>Communicating about service updates</li>
              <li>Analyzing usage patterns</li>
              <li>Ensuring platform security</li>
            </ul>
          </div>
        </PolicySection>

        {/* Data Sharing */}
        <PolicySection icon={Globe} title="Information Sharing">
          <p className="text-gray-300 mb-4">
            We may share your information with:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Potential employers (with your consent)</li>
            <li>Service providers and partners</li>
            <li>Legal authorities when required</li>
          </ul>
        </PolicySection>

        {/* Data Security */}
        <PolicySection icon={Lock} title="Data Security">
          <p className="text-gray-300 mb-4">
            We implement appropriate technical and organizational measures to protect your personal information, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
            <li>Employee training on data protection</li>
          </ul>
        </PolicySection>

        {/* Your Rights */}
        <PolicySection icon={Eye} title="Your Rights">
          <div className="space-y-4 text-gray-300">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Request corrections or deletions</li>
              <li>Object to processing</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>
          </div>
        </PolicySection>

        {/* Updates */}
        <PolicySection icon={Bell} title="Policy Updates">
          <p className="text-gray-300">
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date at the top of this policy.
          </p>
        </PolicySection>

        {/* Contact Section */}
        <motion.section 
          className="mt-16 p-6 bg-gray-800 rounded-lg border border-gray-700"
          {...fadeIn}
        >
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">Contact Us</h2>
          <p className="text-gray-300 mb-4">
            If you have any questions about this Privacy Policy, please contact us:
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

export default PrivacyPolicy;