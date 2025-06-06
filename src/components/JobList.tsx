import { motion } from "framer-motion"
import { Briefcase } from "lucide-react"
import type { Job } from "../types"
import { safeDateDistance } from "@/lib/validate"

interface JobListProps {
  jobs: Job[]
}

export default function JobList({ jobs }: JobListProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {jobs.map((job, index) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="p-6 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-emerald-500/50 transition-all group"
        >
          <div className="flex items-start gap-4">
            {job.company.logo ? (
              <img
                src={job.company.logo || "/placeholder.svg"}
                alt={job.company.name}
                className="w-12 h-12 object-contain rounded-lg bg-white p-1"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-700/50 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-gray-400" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold group-hover:text-emerald-400 transition-colors">
                  <a href={job.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {job.title}
                  </a>
                </h3>
                <span className="text-sm text-gray-400">{safeDateDistance(job.postAt)} ago</span>
              </div>

              <div className="mt-2 space-y-1">
                <p className="text-emerald-400">{job.company.name}</p>
                <p className="text-gray-400">{job.location}</p>
                {job.benefits && <p className="text-sm text-teal-300 mt-2">{job.benefits}</p>}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

