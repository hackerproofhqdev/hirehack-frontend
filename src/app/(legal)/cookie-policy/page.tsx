"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Cookie, Shield, Settings, Database, Globe, Bell, CheckCircle, XCircle } from 'lucide-react';

const CookiesPolicy = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const CookieSection = ({ icon: Icon, title, children }:any) => (
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

  const CookieType = ({ title, description, essential = false }:any) => (
    <motion.div 
      className="p-4 bg-gray-800 rounded-lg border border-gray-700 mb-4"
      variants={fadeIn}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {essential ? (
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full">Essential</span>
        ) : (
          <span className="px-2 py-1 bg-gray-700 text-gray-300 text-sm rounded-full">Optional</span>
        )}
      </div>
      <p className="text-gray-300">{description}</p>
    </motion.div>
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
            Cookies Policy
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300"
            {...fadeIn}
          >
            Last updated: November 4, 2024
          </motion.p>
        </motion.div>

        {/* Introduction */}
        <CookieSection icon={Cookie} title="About Cookies">
          <p className="text-gray-300">
            Our website uses cookies and similar technologies to ensure the basic functionality of the website and to enhance your online experience. This policy provides detailed information about how and when we use cookies.
          </p>
        </CookieSection>

        {/* Types of Cookies */}
        <CookieSection icon={Database} title="Types of Cookies We Use">
          <div className="space-y-4">
            <CookieType 
              title="Essential Cookies"
              description="These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website."
              essential={true}
            />
            
            <CookieType 
              title="Performance Cookies"
              description="These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously."
            />
            
            <CookieType 
              title="Functional Cookies"
              description="These cookies enable the website to provide enhanced functionality and personalization, such as remembering your preferences and settings."
            />
            
            <CookieType 
              title="Targeting Cookies"
              description="These cookies are used to deliver advertisements more relevant to you and your interests."
            />
          </div>
        </CookieSection>

        {/* How We Use Cookies */}
        <CookieSection icon={Settings} title="How We Use Cookies">
          <div className="space-y-4 text-gray-300">
            <p>We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Authentication and security</li>
              <li>Preferences and settings</li>
              <li>Analytics and performance</li>
              <li>Personalized content</li>
              <li>Advertising and targeting</li>
            </ul>
          </div>
        </CookieSection>

        {/* Third-Party Cookies */}
        <CookieSection icon={Globe} title="Third-Party Cookies">
          <div className="space-y-4 text-gray-300">
            <p>Some cookies are placed by third-party services that appear on our pages:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Analytics providers (e.g., Google Analytics)</li>
              <li>Advertising networks</li>
              <li>Social media platforms</li>
              <li>Content delivery networks</li>
            </ul>
          </div>
        </CookieSection>

        {/* Cookie Management */}
        <CookieSection icon={Shield} title="Managing Your Cookie Preferences">
          <div className="space-y-4 text-gray-300">
            <p>You can manage your cookie preferences in several ways:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Through our cookie settings panel</li>
              <li>Using your browser settings</li>
              <li>Via third-party opt-out tools</li>
            </ul>
            
            <div className="mt-6 space-y-4">
              <h3 className="text-xl font-semibold text-white">Browser Settings</h3>
              <p>Most web browsers allow you to manage cookies through their settings preferences. Common browsers include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Google Chrome</li>
                <li>Mozilla Firefox</li>
                <li>Safari</li>
                <li>Microsoft Edge</li>
              </ul>
            </div>
          </div>
        </CookieSection>

        {/* Updates to Policy */}
        <CookieSection icon={Bell} title="Updates to This Policy">
          <p className="text-gray-300">
            We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons. We will notify you of any material changes through our website or other communications.
          </p>
        </CookieSection>

        {/* Contact Section */}
        <motion.section 
          className="mt-16 p-6 bg-gray-800 rounded-lg border border-gray-700"
          {...fadeIn}
        >
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">Questions About Cookies?</h2>
          <p className="text-gray-300 mb-4">
            If you have any questions about our use of cookies, please contact us:
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

export default CookiesPolicy;