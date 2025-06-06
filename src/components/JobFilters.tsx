import { motion } from "framer-motion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface JobFiltersProps {
  jobType: string
  setJobType: (value: string) => void
  datePosted: string
  setDatePosted: (value: string) => void
  onsiteRemote: string
  setOnsiteRemote: (value: string) => void
  experienceLevel: string
  setExperienceLevel: (value: string) => void
  setPage: (value: number) => void
}

export default function JobFilters({
  jobType,
  setJobType,
  datePosted,
  setDatePosted,
  onsiteRemote,
  setOnsiteRemote,
  experienceLevel,
  setExperienceLevel,
  setPage,
}: JobFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto mt-8 bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row gap-4"
    >
      <div className="flex-1">
        <label className="text-gray-300 mb-1 block">Job Type:</label>
        <Select
          value={jobType}
          onValueChange={(value) => {
            setJobType(value)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full bg-gray-900 text-gray-300 border-gray-700">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-gray-300 border-gray-700">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="fullTime">Full-Time</SelectItem>
            <SelectItem value="partTime">Part-Time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <label className="text-gray-300 mb-1 block">Date Posted:</label>
        <Select
          value={datePosted}
          onValueChange={(value) => {
            setDatePosted(value)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full bg-gray-900 text-gray-300 border-gray-700">
            <SelectValue placeholder="Any Time" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-gray-300 border-gray-700">
            <SelectItem value="anyTime">Any Time</SelectItem>
            <SelectItem value="past24Hours">Last 24 hours</SelectItem>
            <SelectItem value="pastWeek">Last 7 days</SelectItem>
            <SelectItem value="pastMonth">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <label className="text-gray-300 mb-1 block">Work Location:</label>
        <Select
          value={onsiteRemote}
          onValueChange={(value) => {
            setOnsiteRemote(value)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full bg-gray-900 text-gray-300 border-gray-700">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-gray-300 border-gray-700">
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="onSite">On-site</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <label className="text-gray-300 mb-1 block">Experience Level:</label>
        <Select
          value={experienceLevel}
          onValueChange={(value) => {
            setExperienceLevel(value)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full bg-gray-900 text-gray-300 border-gray-700">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-gray-300 border-gray-700">
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
            <SelectItem value="entryLevel">Entry Level</SelectItem>
            <SelectItem value="associate">Associate</SelectItem>
            <SelectItem value="midSeniorLevel">Mid-Senior Level</SelectItem>
            <SelectItem value="director">Director</SelectItem>
            <SelectItem value="executive">Executive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  )
}