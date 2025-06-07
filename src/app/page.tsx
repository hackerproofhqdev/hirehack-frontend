"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Menu,
  X,
  ChevronRight,
  Shield,
  Zap,
  Code,
  ChevronDown,
  BrainCircuit,
  FileText,
  Users,
  Trophy,
  CheckCircle2,
  Brain,
  Search,
  Target,
  Briefcase,
  Rocket
} from 'lucide-react';
import Navbar from '@/components/MainNav';

const AnimatedBoxes = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="absolute animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${10 + i}s infinite`,
          animationDelay: `${i * 0.5}s`
        }}
      >
        <div className="w-32 h-32 rotate-45 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg" />
      </div>
    ))}
  </div>
);

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [openFaqIndex, setOpenFaqIndex] = React.useState(null);

  // FAQ Data
  const faqs = [
    {
      question: "How can Hire Hack improve my job search?",
      answer: "Our platform uses advanced AI to analyze your resume, suggest improvements, and match you with relevant positions. We also provide personalized interview preparation and skill gap analysis."
    },
    {
      question: "What makes your AI analysis different from other platforms?",
      answer: "Our AI technology provides real-time feedback, industry-specific insights, and tailored recommendations based on current market trends and employer requirements."
    },
    {
      question: "How often is the AI model updated?",
      answer: "Our AI models are updated monthly to reflect the latest job market trends, industry requirements, and employer preferences."
    },
    {
      question: "Can I get feedback on my interview performance?",
      answer: "Yes, our AI-powered mock interview system provides detailed feedback on your responses, body language, and communication skills."
    },
    {
      question: "How accurate is the resume analysis?",
      answer: "Our AI achieves 95% accuracy in resume analysis, validated against industry standards and real hiring manager preferences."
    },
    {
      question: "What industries does the platform cover?",
      answer: "We cover all major industries including Tech, Finance, Healthcare, Marketing, and more, with specialized AI models for each sector."
    },
    {
      question: "How long does the AI analysis take?",
      answer: "Most analyses are completed within 5-10 minutes, with comprehensive reports delivered instantly."
    },
    {
      question: "Can I track my progress over time?",
      answer: "Yes, we provide detailed analytics and progress tracking to show your improvement in various areas."
    },
    {
      question: "Is my data secure?",
      answer: "We use enterprise-grade encryption and follow strict data protection protocols to ensure your information is secure."
    },
    {
      question: "What support do you offer if I need help?",
      answer: "We provide 24/7 chat support, detailed documentation, and regular webinars to help you maximize the platform's benefits."
    }
  ];

  // Success Stories
  const successStories = [
    {
      name: "Sarah Chen",
      role: "Data Scientist at Tech Giant",
      story: "The AI analysis helped me optimize my resume, leading to a 40% increase in interview calls.",
      improvement: "200% salary increase"
    },
    {
      name: "James Rodriguez",
      role: "Marketing Director",
      story: "Mock interviews with AI feedback transformed my interview performance completely.",
      improvement: "Landed dream job in 2 weeks"
    },
    {
      name: "Priya Patel",
      role: "Software Engineer",
      story: "The skill gap analysis helped me focus on crucial areas, making me more competitive.",
      improvement: "3 job offers in one month"
    },
    {
      name: "Michael Chang",
      role: "Product Manager",
      story: "AI insights helped me tailor my applications to each company's specific needs.",
      improvement: "50% faster job search"
    },
    {
      name: "Emma Thompson",
      role: "UX Designer",
      story: "The portfolio optimization suggestions were game-changing for my applications.",
      improvement: "Doubled portfolio views"
    },
    {
      name: "Ahmed Hassan",
      role: "Financial Analyst",
      story: "Industry-specific tips helped me stand out in a competitive field.",
      improvement: "30% higher offer"
    },
    {
      name: "Lisa Johnson",
      role: "HR Manager",
      story: "The AI's culture fit analysis was spot-on for my career transition.",
      improvement: "Successful industry switch"
    },
    {
      name: "Carlos Martinez",
      role: "Cloud Architect",
      story: "Technical skill assessments helped me gauge my market value accurately.",
      improvement: "45% salary increase"
    },
    {
      name: "Nina Patel",
      role: "Business Analyst",
      story: "Resume keywords optimization increased my application success rate significantly.",
      improvement: "90% interview rate"
    },
    {
      name: "David Wilson",
      role: "Sales Director",
      story: "The presentation skills feedback helped me ace my final round interviews.",
      improvement: "Dream role achieved"
    }
  ];

  // How It Works Steps
  const steps = [
    {
      icon: <FileText className="w-12 h-12 text-emerald-400" />,
      title: "Upload Resume",
      description: "Submit your resume for AI-powered analysis and optimization suggestions."
    },
    {
      icon: <BrainCircuit className="w-12 h-12 text-emerald-400" />,
      title: "AI Analysis",
      description: "Our AI analyzes your profile against industry standards and job requirements."
    },
    {
      icon: <Brain className="w-12 h-12 text-emerald-400" />,
      title: "Get Insights",
      description: "Receive detailed feedback and personalized improvement recommendations."
    },
    {
      icon: <CheckCircle2 className="w-12 h-12 text-emerald-400" />,
      title: "Optimize & Apply",
      description: "Implement suggestions and apply with your enhanced profile."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Bar */}
      <Navbar text='Login'/>

      <section className="relative pt-32 pb-24 overflow-hidden">
      
      {/* SVG Background */}
      <svg
        className="absolute top-0 left-0 w-full h-full text-green-500/5"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* Define the animated stroke */}
          <linearGradient id="animated-gradient" gradientTransform="rotate(0)">
            <stop offset="0%" stopColor="white" stopOpacity="0.8">
              <animate
                attributeName="offset"
                values="0;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="white" stopOpacity="0.8">
              <animate
                attributeName="offset"
                values="0.5;1.5"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="white" stopOpacity="0.8">
              <animate
                attributeName="offset"
                values="1;2"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>
        <pattern
          id="circuit-pattern"
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 10 0 L 10 10 M 0 10 L 20 10 M 5 10 L 5 20"
            className="stroke-current animate-moveLight"
            fill="none"
            strokeWidth="0.5"
            stroke="url(#animated-gradient)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="40"
            strokeDashoffset="0"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
      </svg>

      {/* Animated Boxes */}
      <AnimatedBoxes />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
            Power Your Career with AI
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Let artificial intelligence guide your job search and career development. Find the perfect opportunities tailored to your skills and aspirations.
          </p>
          <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-2 mx-auto">
            <Link href={'/register'} className='flex'>Get Started <ChevronRight size={20} /></Link>
          </button>
        </div>
      </div>
    </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
            Our Features & Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-12 h-12 text-emerald-400" />,
                title: "AI-Powered Matching",
                description: "Advanced algorithms match your skills with perfect job opportunities"
              },
              {
                icon: <Search className="w-12 h-12 text-emerald-400" />,
                title: "Smart Job Search",
                description: "Intelligent filtering and personalized job recommendations"
              },
              {
                icon: <Target className="w-12 h-12 text-emerald-400" />,
                title: "Interview Preparation",
                description: "Check Your Interview Readiness and Get Feedback"
              },
              {
                icon: <Briefcase className="w-12 h-12 text-emerald-400" />,
                title: "Resume Anaysis",
                description: "AI-assisted resume optimization and keyword suggestions"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-emerald-500/50 transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/4 right-0 transform translate-x-1/2">
                    <ChevronRight className="w-8 h-8 text-emerald-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-24 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
            Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-emerald-500/50 transition-all">
                <div className="flex items-center mb-4">
                  <Trophy className="w-8 h-8 text-emerald-400 mr-3" />
                  <div>
                    <h3 className="font-semibold text-lg">{story.name}</h3>
                    <p className="text-emerald-400 text-sm">{story.role}</p>
                  </div>
                </div>
                <p className="text-gray-400 mb-4">{story.story}</p>
                <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-sm inline-block">
                  {story.improvement}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-700 rounded-lg overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-800/50 transition-all"
                  // @ts-ignore
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  aria-expanded={openFaqIndex === index}
                  aria-controls={`faq-${index}`}
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 transform transition-transform ${
                      openFaqIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div id={`faq-${index}`} className="px-6 py-4 bg-gray-800/30 text-gray-400">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
                HireHack
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Empowering careers with AI-driven insights and personalized job matching solutions.
              </p>
              <div className="mt-6 flex space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">H</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:col-span-2">
              <div>
                <h4 className="font-semibold text-lg mb-6 text-emerald-400">Company</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/about" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/story" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      Our Story
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-6 text-emerald-400">Legal</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/privacy-policy" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookie-policy" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-center md:text-left">
                &copy; 2024 HireHack. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
                <span className="text-gray-400 text-sm">Powered by HackerProof</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
