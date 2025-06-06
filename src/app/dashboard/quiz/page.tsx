"use client";
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { logout } from "@/actions/logout"
import { getUserProfile } from "@/actions/getUserProfile"
import { generateQuiz } from "@/actions/quizActions"
import QuizHeader from "@/components/QuizHeader"
import TrialStatusBanner from "@/components/TrialStatusBanner"
import LoadingScreen from "@/components/LoadingScreen"
import QuizForm from "@/components/QuizForm"
import QuizQuestions from "@/components/QuizQuestions"
import QuizResults from "@/components/QuizResults"
import { useRouter } from "next/navigation"
import { Client } from "@langchain/langgraph-sdk";

interface UserProfile {
  plain_period: string | null
  subscription_status: "free_trial" | "active" | "inactive"
  username: string
  password: string
  email: string
  id: number
}

interface ProjectSuggestion {
  title: string
  description: string
  estimated_time: string
  difficulty: string
  key_concept: string
  expected_outcome: string
  code_template: string
}

interface QuizQuestion {
  question: string
  concept: string
  options: string[]
  answer: string
  detail: string
  related_project: ProjectSuggestion
}

export default function QuizPage() {
  const { toast } = useToast()

  // Global states
  const [quizSettings, setQuizSettings] = useState({
    topic: "",
    jobDescription: "",
    numQuestions: "5",
  })
  const [answers, setAnswers] = useState<string[]>([])
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const {push} = useRouter()

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const profile = await getUserProfile()
        setUserProfile(profile as UserProfile)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        })
      }
    }
    loadUserData()
  }, [toast])

  // Fetch quiz data
  const fetchQuizData = async () => {
    if (!userProfile) return

    if (userProfile.subscription_status === "free_trial") {
      toast({
        title: "Premium Feature",
        description: "Quiz generation is only available for premium users",
        variant: "destructive",
      })
      return
    }

    if (!quizSettings.topic.trim() || !quizSettings.jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter both a job title and a job description",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const client = new Client({
        apiKey: process.env.NEXT_PUBLIC_LANGCHAIN_API_KEY,
        apiUrl: process.env.NEXT_PUBLIC_LANGCHAIN_URI
      })
      const response : any = await client.runs.wait(
        null,
        "quiz_agent",
        {
          input : {
            messages : [
             {
              type:"human",
              content : `Here is **Job Title** : ${ quizSettings.topic } \n **Job Description** : ${ quizSettings.jobDescription }`
             },
             {
              type : "human",
              content : `"Generate me ${Number.parseInt(quizSettings.numQuestions)}`
             }
            ]
          }
        }
      )
      const quizData  =  response.quiz
      setQuestions(quizData)
      setAnswers(new Array(quizData.length).fill(""))
      setShowQuiz(true)
      toast({
        title: "Quiz Generated!",
        description: "Good luck with your practice! Each question includes a hands-on project.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate quiz",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle form input change
  const handleInputChange = (name: string, value: string) => {
    setQuizSettings((prev) => ({ ...prev, [name]: value }))
  }

  // Navigate questions
  const handleQuestionNavigation = (direction: "next" | "prev") => {
    setCurrentQuestionIndex((prev) => {
      const newIndex = direction === "next" ? prev + 1 : prev - 1
      return Math.max(0, Math.min(questions.length - 1, newIndex))
    })
  }

  // Select an answer
  const handleAnswerSelect = (selectedAnswer: string) => {
    setAnswers((prev) => {
      const updated = [...prev]
      updated[currentQuestionIndex] = selectedAnswer
      return updated
    })
  }

  // Calculate final score
  const calculateScore = () => {
    const correctAnswers = questions.filter((q, index) => q.answer === answers[index]).length
    return (correctAnswers / questions.length) * 100
  }

  // Submit quiz
  const handleSubmit = () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setShowResults(true)
  }

  // Reset quiz
  const resetQuiz = () => {
    setQuizSettings({ topic: "", jobDescription: "", numQuestions: "5" })
    setAnswers([])
    setQuestions([])
    setCurrentQuestionIndex(0)
    setShowQuiz(false)
    setShowResults(false)
    setScore(0)
  }

  // On Home
  const onHome = () => {
    push('/dashboard')
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (showResults) {
    return (
      <QuizResults
        score={score}
        questions={questions}
        answers={answers}
        onReset={resetQuiz}
        onHome={onHome}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 overflow-hidden">
      {/* Header */}
      <QuizHeader onLogout={logout} />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Smart Quiz Generator
          </h1>

          {/* Trial/Premium Banner */}
          {userProfile && (
            <TrialStatusBanner subscription_status={userProfile.subscription_status} />
          )}

          {/* If user has not started quiz, show form, else show quiz questions */}
          {!showQuiz ? (
            <QuizForm
              quizSettings={quizSettings}
              onInputChange={handleInputChange}
              onGenerateQuiz={fetchQuizData}
              subscription_status={userProfile?.subscription_status ?? "inactive"}
            />
          ) : (
            <QuizQuestions
              questions={questions}
              answers={answers}
              currentIndex={currentQuestionIndex}
              onAnswerSelect={handleAnswerSelect}
              onNavigation={handleQuestionNavigation}
              onSubmit={handleSubmit}
            />
          )}
        </motion.div>
      </div>

      <Toaster />
    </div>
  )
}
