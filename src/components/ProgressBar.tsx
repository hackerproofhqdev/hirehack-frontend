import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

interface ProgressBarProps {
  progress?: number;
  infinite?: boolean;
}

const ProgressBar = ({ progress = 0, infinite = false }: ProgressBarProps) => {
  const [infiniteProgress, setInfiniteProgress] = useState(0)

  useEffect(() => {
    if (infinite) {
      const interval = setInterval(() => {
        setInfiniteProgress((prev) => {
          // Create a wave-like effect that moves between 15% and 85%
          if (prev >= 85) {
            return 15
          }
          return prev + 1
        })
      }, 20)

      return () => clearInterval(interval)
    }
  }, [infinite])

  const displayProgress = infinite ? infiniteProgress : progress
  const displayText = infinite ? "Processing..." : `${Math.round(progress)}%`

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-xs text-gray-400">
        <span>{infinite ? "Generating Resume" : "Processing"}</span>
        <span>{displayText}</span>
      </div>
      <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        {/* Base progress bar */}
        <div 
          className={`h-full ${infinite ? 'bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-500 background-animate' : 'bg-teal-500'}`}
          style={{ 
            width: `${displayProgress}%`,
            transition: infinite ? 'width 0.3s ease' : 'width 0.5s ease-out'
          }}
        />
        
        {/* Animated overlay for infinite mode */}
        {infinite && (
          <div className="absolute inset-0 w-full h-full">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-teal-300/30 to-transparent animate-shimmer" />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProgressBar

// Add this to your global CSS or as a style tag
// .background-animate {
//   background-size: 400%;
//   animation: gradient 3s ease infinite;
// }
// 
// @keyframes gradient {
//   0%, 100% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
// }
// 
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// } 