'use client'

import { motion } from "framer-motion"
import { Book, BrainCircuit, Briefcase, GraduationCap, Rocket, Users } from "lucide-react"
import Link from "next/link"

export default function OurStoryPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const timelineEvents = [
    { year: 2020, title: "The Idea", icon: BrainCircuit, description: "Hire Hack was conceived as a solution to modernize the job search process." },
    { year: 2021, title: "Development Begins", icon: Briefcase, description: "Our team of AI specialists and developers started building the platform." },
    { year: 2022, title: "Beta Launch", icon: Rocket, description: "We launched our beta version, gathering valuable user feedback." },
    { year: 2023, title: "Official Release", icon: GraduationCap, description: "Hire Hack was officially released to the public." },
    { year: 2024, title: "Expanding Horizons", icon: Users, description: "We continue to grow, helping thousands find their dream jobs." }
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <Book className="h-8 w-8 text-emerald-400" />
              </Link>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link href="/" className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                  <Link href="/about" className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</Link>
                  <Link href="/our-story" className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium">Our Story</Link>
                  <Link href="/complaint" className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contact</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden py-20 sm:py-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,#0a2a1c,transparent_70%)]" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            {...fadeIn}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
              Our Story
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-400">
              Discover how Hire Hack evolved from an idea to a revolutionary platform transforming the job search landscape.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Timeline Section */}
      <motion.section 
        className="py-16 md:py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {timelineEvents.map((event, index) => (
              <motion.div 
                key={index}
                className="relative pl-8 pb-8 border-l border-gray-700"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="absolute left-0 top-0 mt-1 -ml-2.5 h-5 w-5 rounded-full bg-emerald-500" />
                <div className="flex items-center mb-2">
                  <event.icon className="w-6 h-6 text-emerald-400 mr-2" />
                  <h3 className="text-xl font-semibold text-emerald-400">{event.year}: {event.title}</h3>
                </div>
                <p className="text-gray-400">{event.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Mission & Vision Section */}
      <motion.section 
        className="py-16 md:py-24 bg-gray-900/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div 
              className="space-y-4"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-emerald-400">Our Mission</h2>
              <p className="text-gray-300">
                To revolutionize the job search process by leveraging cutting-edge AI technology, making it more efficient,
                personalized, and successful for job seekers worldwide.
              </p>
            </motion.div>
            <motion.div 
              className="space-y-4"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-emerald-400">Our Vision</h2>
              <p className="text-gray-300">
                To create a world where every individual can easily find and secure their dream job, fostering career
                satisfaction and professional growth on a global scale.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        className="py-16 md:py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
            Join Us in Shaping the Future of Job Search
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Be part of our journey as we continue to innovate and improve the job search experience for millions.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition duration-150 ease-in-out"
          >
            Get Started
          </Link>
        </div>
      </motion.section>
    </div>
  )
}