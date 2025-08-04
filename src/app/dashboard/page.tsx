"use client";
import React from 'react';
import { motion } from 'framer-motion';
import  {
  FileText,
  Search,
  Video,
  Brain,
  User2,
  Save,
  FileUp,
}  from 'lucide-react';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import { FeatureCard } from '@/components/FeatureCard';

const UserHome = () => {
  const features = [
    {
      title: "AI Resume Analyzer",
      description: "Get instant AI-powered feedback on your resume and unlock its full potential",
      icon: <FileText className="w-6 h-6" />,
      link: "/dashboard/resumeAnalysis",
    },
    {
      title: "AI Resume Builder",
      description: "Create stunning resumes with smart AI suggestions and professional templates",
      icon: <FileUp className="w-6 h-6" />,
      link: "/dashboard/resumeAnalysis/create",
    },

    {
      title: "Interview Prep",
      description: "Master your interview skills with AI-powered practice sessions",
      icon: <Video className="w-6 h-6" />,
      link: "/dashboard/interviewprep",
    },
    {
      title: "Quiz Generation",
      description: "Enhance your knowledge with customized skill assessment quizzes",
      icon: <Brain className="w-6 h-6" />,
      link: "/dashboard/quiz",
    },
    {
      title: "User Profile",
      description: "Customize your preferences and manage your career objectives",
      icon: <User2 className="w-6 h-6" />,
      link: "/dashboard/userProfile",
    },
    {
      title: "Saved Resumes",
      description: "Access your collection of polished resumes and templates",
      icon: <Save className="w-6 h-6" />,
      link: "/dashboard/saveResume",
    },
    {
      title: "Complaint Portal",
      description: "Complaint Any Issue To the Service team To review By Hirehack service team",
      icon: <FileText className="w-6 h-6" />,
      link: "/dashboard/complaint",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardNavbar />

      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-12 px-4"
          >
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
            <h1 className="relative text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-transparent bg-clip-text inline-block">
              Welcome to Your Dashboard
            </h1>
            <p className="text-gray-400 mt-4 max-w-2xl">
              Unlock your career potential with our AI-powered tools and resources.
              Select a feature below to get started on your journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserHome;