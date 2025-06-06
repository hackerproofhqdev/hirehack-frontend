"use client"

import { useState, HTMLAttributes } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Code, Timer, BookOpen, Target } from "lucide-react"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism"

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
  options: string[]
  answer: string
  detail: string
  concept: string
  related_project: ProjectSuggestion
}

interface QuizQuestionsProps {
  questions: QuizQuestion[]
  answers: string[] // the user's selected answers
  currentIndex: number // which question is currently shown
  onAnswerSelect: (selectedAnswer: string) => void
  onNavigation: (direction: "next" | "prev") => void
  onSubmit: () => void
}

/**
 * Custom type for our feedback:
 * "correct", "incorrect", or null (unanswered).
 */
type FeedbackState = ("correct" | "incorrect" | null)[]

export default function QuizQuestions({
  questions,
  answers,
  currentIndex,
  onAnswerSelect,
  onNavigation,
  onSubmit,
}: QuizQuestionsProps) {
  const [feedback, setFeedback] = useState<FeedbackState>(
    () => Array(questions.length).fill(null) // Initially all null
  )
  const [showProject, setShowProject] = useState(false)

  const currentQuestion = questions[currentIndex]
  const progressValue = ((currentIndex + 1) / questions.length) * 100

  // Whenever the user picks an option, we immediately set "correct" or "incorrect"
  const handleOptionClick = (option: string) => {
    onAnswerSelect(option)
    const isCorrect = option === currentQuestion.answer
    setFeedback((prev) => {
      const updated = [...prev]
      updated[currentIndex] = isCorrect ? "correct" : "incorrect"
      return updated
    })
  }

  // Reusable code block renderer for Markdown
  const CodeBlock = ({
    inline,
    className,
    children,
    ...props
  }: HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
    const match = /language-(\w+)/.exec(className || "")
    return !inline && match ? (
      <SyntaxHighlighter
        style={oneDark}
        language={match[1]}
        PreTag="div"
        wrapLongLines
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  return (
    <motion.div
      key="quiz"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Progress Bar */}
      <Progress value={progressValue} className="h-3 bg-gray-700" />

      {/* Question Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-teal-400">
          <BookOpen className="w-5 h-5" />
          <span className="font-medium">Concept: {currentQuestion?.concept}</span>
        </div>
        
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className="prose prose-invert max-w-none" // For nice typography in a dark theme
          components={{
            code: CodeBlock,
          }}
        >
          {currentQuestion?.question || ""}
        </ReactMarkdown>

        {/* Options with immediate feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion?.options.map((option, idx) => {
            const userChoice = answers[currentIndex]
            const userFeedback = feedback[currentIndex] // "correct" or "incorrect" or null

            // Is this option the correct answer?
            const isCorrectAnswer = option === currentQuestion.answer
            // Is this option the user clicked on?
            const isUserChoice = option === userChoice

            // Default style for each option
            let optionStyle =
              "bg-gray-700/20 text-white border-gray-600 hover:text-white hover:bg-gray-600/20"

            // If user has answered, highlight correct/wrong
            if (userFeedback) {
              if (isCorrectAnswer) {
                // Mark correct answer as green
                optionStyle = "bg-green-500/20 text-green-400 border-green-400"
              } else if (isUserChoice && !isCorrectAnswer) {
                // Mark user's wrong choice as red
                optionStyle = "bg-red-500/20 text-red-400 border-red-400"
              }
            }

            return (
              <div key={idx} className="overflow-hidden">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant={isUserChoice ? "default" : "outline"}
                    className={`w-full h-auto min-h-14 justify-start text-left text-sm text-wrap flex items-center p-4 transition-colors duration-200 ${optionStyle}`}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option}
                  </Button>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Explanation and Project Section */}
      {feedback[currentIndex] !== null && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Explanation */}
          <div className="p-4 bg-gray-700/20 rounded-lg backdrop-blur-sm">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="prose prose-invert max-w-none text-sm text-teal-300"
              components={{
                code: CodeBlock,
              }}
            >
              {currentQuestion.detail}
            </ReactMarkdown>
          </div>

          {/* Project Section Toggle */}
          <Button
            variant="outline"
            className="w-full bg-teal-500/10 hover:bg-teal-500/20 text-teal-400"
            onClick={() => setShowProject(!showProject)}
          >
            {showProject ? "Hide Practice Project" : "Show Practice Project"}
          </Button>

          {/* Project Details */}
          {showProject && currentQuestion.related_project && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-gray-800/50 rounded-lg space-y-6"
            >
              <h3 className="text-xl font-semibold text-teal-400">
                {currentQuestion.related_project.title}
              </h3>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Timer className="w-4 h-4" />
                  <span>{currentQuestion.related_project.estimated_time}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Target className="w-4 h-4" />
                  <span>{currentQuestion.related_project.difficulty}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-teal-400">Implementation Steps:</h4>
                <ReactMarkdown
                  className="prose prose-invert max-w-none text-sm"
                  components={{ code: CodeBlock }}
                >
                  {currentQuestion.related_project.description}
                </ReactMarkdown>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-teal-400">Expected Outcome:</h4>
                <p className="text-sm text-gray-300">
                  {currentQuestion.related_project.expected_outcome}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-teal-400" />
                  <h4 className="font-medium text-teal-400">Starting Template:</h4>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <SyntaxHighlighter
                    language="javascript"
                    style={oneDark}
                    wrapLongLines
                  >
                    {currentQuestion.related_project.code_template}
                  </SyntaxHighlighter>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        {/* Previous Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigation("prev")}
          disabled={currentIndex === 0}
          className="text-gray-300 hover:bg-gray-700/20 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Previous
        </Button>

        {/* Next or Submit Button */}
        {currentIndex < questions.length - 1 ? (
          <Button
            onClick={() => onNavigation("next")}
            disabled={!answers[currentIndex]}
            className="bg-teal-500/20 hover:bg-teal-600/20 text-teal-400 transition-colors duration-200"
          >
            Next <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={!answers[currentIndex]}
            className="bg-teal-500 hover:bg-teal-600 transition-colors duration-200"
          >
            Submit Answers
          </Button>
        )}
      </div>
    </motion.div>
  )
}
