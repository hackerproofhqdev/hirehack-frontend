"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Home } from "lucide-react"

interface QuizQuestion {
  question: string
  options: string[]
  answer: string
  detail: string
}

interface QuizResultsProps {
  score: number
  questions: QuizQuestion[]
  answers: string[]
  onReset: () => void
  onHome: () => void
}

export default function QuizResults({ score, questions, answers, onReset, onHome }: QuizResultsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Quiz Results
            </h1>
            <div className="flex space-x-2">
              <Button
                onClick={onHome}
                variant="outline"
                className="bg-gray-700/20 hover:bg-gray-600/20 text-gray-200 transition-colors duration-200"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button
                onClick={onReset}
                variant="outline"
                className="bg-teal-500/20 hover:bg-teal-600/20 text-teal-400 transition-colors duration-200"
              >
                New Quiz
              </Button>
            </div>
          </div>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="text-7xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent"
                >
                  {Math.round(score)}%
                </motion.div>
                <Progress value={score} className="h-3 bg-gray-700" />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {questions.map((question, index) => {
              const userIsCorrect = answers[index] === question.answer
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Alert
                    className={`${
                      userIsCorrect
                        ? "border-green-500/20 bg-green-500/10"
                        : "border-red-500/20 bg-red-500/10"
                    } backdrop-blur-sm`}
                  >
                    <AlertDescription className="space-y-4">
                      <div className="flex items-start gap-3">
                        {userIsCorrect ? (
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-400" />
                        )}
                        <div className="space-y-3">
                          <h3 className="font-medium text-white text-lg">
                            {question.question}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {question.options.map((option, optIndex) => (
                              <span
                                key={optIndex}
                                className={`px-3 py-1 rounded-full text-sm ${
                                  option === question.answer
                                    ? "bg-green-500/20 text-green-400"
                                    : option === answers[index]
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-gray-700/20 text-gray-300"
                                }`}
                              >
                                {option}
                              </span>
                            ))}
                          </div>
                          {!userIsCorrect && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ duration: 0.3 }}
                              className="mt-3 p-4 bg-gray-700/20 rounded-lg backdrop-blur-sm"
                            >
                              <p className="text-sm text-teal-300">
                                {question.detail}
                              </p>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}