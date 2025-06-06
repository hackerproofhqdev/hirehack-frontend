"use client"

import { Loader2 } from "lucide-react"

interface ResumeLoadingProps {
  loadingState: 'uploading' | 'processing' | null
}

export function ResumeLoading({ loadingState }: ResumeLoadingProps) {
  return (
    <section className="h-full pt-20 pb-0 relative">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="max-w-xl mx-auto text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-emerald-500" />
          <p className="text-xl">{loadingState === 'uploading' ? 'Uploading your resume...' : 'Processing your resume...'}</p>
          <p className="text-gray-400 mt-2">{loadingState === 'uploading' ? 'This will only take a moment' : 'This may take a few moments'}</p>
        </div>
      </div>
    </section>
  )
} 