"use client"

import { ChangeEvent } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShieldAlert } from "lucide-react"

interface QuizFormProps {
  quizSettings: {
    topic: string
    jobDescription: string
    numQuestions: string
  }
  onInputChange: (name: string, value: string) => void
  onGenerateQuiz: () => void
  subscription_status: "free_trial" | "active" | "inactive"
}

export default function QuizForm({
  quizSettings,
  onInputChange,
  onGenerateQuiz,
  subscription_status,
}: QuizFormProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onInputChange(e.target.name, e.target.value)
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardContent className="p-6">
        {subscription_status === "free_trial" ? (
          <div className="text-center p-8 space-y-4">
            <ShieldAlert className="w-16 h-16 mx-auto text-purple-400" />
            <h3 className="text-2xl font-semibold text-white">Premium Feature Locked</h3>
            <p className="text-gray-400 text-lg">
              Upgrade to premium to access the quiz generator and other advanced features
            </p>
            <Button asChild className="bg-purple-500 hover:bg-purple-600 transition-colors duration-200">
              <Link href="/pricing">View Pricing Plans</Link>
            </Button>
          </div>
        ) : (
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <Label className="text-gray-300 text-lg">Job Title</Label>
              <Input
                name="topic"
                value={quizSettings.topic}
                onChange={handleChange}
                className="bg-gray-700 text-white border-gray-600 focus:ring-teal-500 text-lg p-3"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-gray-300 text-lg">Job Description</Label>
              <textarea
                name="jobDescription"
                value={quizSettings.jobDescription}
                onChange={handleChange}
                rows={6}
                className="w-full bg-gray-700 text-white border-gray-600 focus:ring-teal-500 rounded-md p-3 text-lg"
                placeholder="Enter the full job description here"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-gray-300 text-lg">Number of Questions</Label>
              <Select
                value={quizSettings.numQuestions}
                onValueChange={(value) => onInputChange("numQuestions", value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-300 text-lg">
                  <SelectValue placeholder="Select question count" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  {[2, 5, 10, 20].map((num) => (
                    <SelectItem key={num} value={num.toString()} className="hover:bg-gray-700 text-lg">
                      {num} Questions
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={onGenerateQuiz}
              className="w-full bg-teal-500 hover:bg-teal-600 transition-colors duration-200 text-lg py-6"
              size="lg"
              disabled={
                !quizSettings.topic.trim() || !quizSettings.jobDescription.trim()
              }
            >
              Generate Quiz
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
