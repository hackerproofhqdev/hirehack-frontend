"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Loader2, Lock, Crown } from "lucide-react"
import { ExclamationCircleIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

import Header from "../../../components/JobSearchHeader"
import JobFilters from "../../../components/JobFilters"
import JobList from "../../../components/JobList"
import Pagination from "../../../components/Pagination"
import { getUserProfile } from "@/actions/getUserProfile"
import type { Job, ApiResponse } from "@/types"

interface UserProfile {
  plain_period: string | null;
  subscription_status: string;
  username: string;
  password: string;
  email: string;
  id: number;
}

export default function JobSearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [jobType, setJobType] = useState("")
  const [datePosted, setDatePosted] = useState("")
  const [onsiteRemote, setOnsiteRemote] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [jobs, setJobs] = useState<Job[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  const jobsPerPage = 10
  const totalPages = Math.ceil(total / jobsPerPage)

  // Check user subscription status
  useEffect(() => {
    const checkUserAccess = async () => {
      try {
        const profile = await getUserProfile()
        setUserProfile(profile)
        
        // Check if user has free trial or active subscription
        const hasValidSubscription = profile.subscription_status === 'active' || 
                                    profile.subscription_status === 'trial' ||
                                    profile.plain_period !== null
        
        setHasAccess(hasValidSubscription)
      } catch (error) {
        console.error('Error checking user profile:', error)
        setHasAccess(false)
      } finally {
        setIsCheckingSubscription(false)
      }
    }

    checkUserAccess()
  }, [])

  const handleSearch = () => {
    // Validate search input
    if (!searchQuery.trim() && !jobType && !datePosted && !onsiteRemote && !experienceLevel) {
      setError("Please enter a search keyword or select at least one filter")
      return
    }

    setError(null)
    setPage(1)
    setHasSearched(true)
    fetchJobs()
  }

  useEffect(() => {
    if (!hasSearched) return
    fetchJobs()
  }, [hasSearched])

  const fetchJobs = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(jobsPerPage),
      })

      if (searchQuery.trim()) {
        queryParams.append("keywords", searchQuery.trim())
      }

      if (jobType) {
        queryParams.append("jobType", jobType)
      }

      if (datePosted) {
        queryParams.append("datePosted", datePosted)
      }

      if (onsiteRemote) {
        queryParams.append("onsiteRemote", onsiteRemote)
      }

      if (experienceLevel) {
        queryParams.append("experienceLevel", experienceLevel)
      }

      let response: Response
      
      try {
        response = await fetch(`/api/jobs?${queryParams.toString()}`)
      } catch (fetchError) {
        // Handle network errors or API endpoint not found
        console.warn("API endpoint not available, using mock data for development")
        
        // Return mock "no jobs found" response for development
        setJobs([])
        setTotal(0)
        setError("No jobs found matching your search criteria. The job search service may be unavailable.")
        return
      }
      
      // Check if response is ok
      if (!response.ok) {
        if (response.status === 404) {
          // API endpoint doesn't exist - show helpful message
          setJobs([])
          setTotal(0)
          setError("Job search service is currently unavailable. Please try again later.")
          return
        } else if (response.status >= 500) {
          throw new Error("Server error occurred. Please try again later.")
        } else {
          throw new Error(`Search failed with status: ${response.status}`)
        }
      }

      // Parse response safely
      let data: ApiResponse
      try {
        data = await response.json()
      } catch (parseError) {
        throw new Error("Invalid response from server")
      }

      // Validate data structure
      if (typeof data !== 'object' || data === null) {
        throw new Error("Invalid data format received")
      }

      // Handle successful response
      if (data.success && Array.isArray(data.data)) {
        setJobs(data.data)
        setTotal(typeof data.total === 'number' ? data.total : 0)
      } else {
        // Handle case where API returns success: false or no data
        setJobs([])
        setTotal(0)
        if ('message' in data && typeof data.message === 'string') {
          setError(data.message)
        }
      }
    } catch (err) {
      console.error("Job search error:", err)
      
      // Handle different types of errors
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError("Network error. Please check your connection and try again.")
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred while searching for jobs")
      }
      
      // Always reset jobs and total on error
      setJobs([])
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking subscription
  if (isCheckingSubscription) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-emerald-500" />
          <p className="text-gray-400">Checking subscription status...</p>
        </div>
      </div>
    )
  }

  // Show paywall if user doesn't have access
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 rounded-2xl border border-gray-700 p-12"
            >
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
                  Premium Feature
                </h1>
                <p className="text-gray-400 text-lg mb-8">
                  Job Search is available for users with active subscriptions or free trial access.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center gap-3 text-emerald-400">
                  <Crown className="w-5 h-5" />
                  <span>Search Jobs Worldwide</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-emerald-400">
                  <Crown className="w-5 h-5" />
                  <span>Advanced Filtering Options</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-emerald-400">
                  <Crown className="w-5 h-5" />
                  <span>Personalized Job Recommendations</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/pricing')}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2"
                >
                  <Crown className="w-5 h-5" />
                  Upgrade to Premium
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-8 py-3 rounded-lg border border-gray-600 hover:border-gray-500 transition-all"
                >
                  Back to Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text"
            >
              Find Your Next Role
            </motion.h1>

            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs worldwide..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-12 pr-32 py-4 rounded-lg bg-gray-800 border border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 text-white placeholder-gray-400 transition-all"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-md hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Search
                      <Search className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <JobFilters
            jobType={jobType}
            setJobType={setJobType}
            datePosted={datePosted}
            setDatePosted={setDatePosted}
            onsiteRemote={onsiteRemote}
            setOnsiteRemote={setOnsiteRemote}
            experienceLevel={experienceLevel}
            setExperienceLevel={setExperienceLevel}
            setPage={setPage}
          />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-16 space-y-8">
            {error && (
              <div className="text-center py-8 text-red-400 flex flex-col items-center gap-2">
                <ExclamationCircleIcon className="h-12 w-12" />
                <p>{error}</p>
              </div>
            )}

            {!isLoading && hasSearched && jobs.length === 0 && !error && (
              <div className="text-center py-8 text-gray-400">No jobs found matching your criteria.</div>
            )}

            {isLoading && (
              <div className="grid md:grid-cols-2 gap-6 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-800/50 rounded-lg border border-gray-700" />
                ))}
              </div>
            )}

            {!isLoading && jobs.length > 0 && <JobList jobs={jobs} />}

            {!isLoading && hasSearched && total > 0 && (
              <Pagination page={page} totalPages={totalPages} setPage={setPage} />
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

