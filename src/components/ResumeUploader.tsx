"use client"

import { useRef } from 'react'
import { motion } from "framer-motion"
import { readFile } from '@/actions/resumeActions'
import { Client } from "@langchain/langgraph-sdk"
import { Upload, FileText, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface ResumeUploaderProps {
  setLoading: (loading: boolean) => void
  setLoadingState: (state: 'uploading' | 'processing' | null) => void
  setParsedResume: (resume: any) => void
  setEditedResume: (resume: any) => void
}

export function ResumeUploader({ 
  setLoading, 
  setLoadingState, 
  setParsedResume, 
  setEditedResume 
}: ResumeUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is PDF or DOCX
    const fileType = file.type
    if (
      fileType !== "application/pdf" &&
      fileType !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF or DOCX file",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setLoadingState('uploading')
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      // Get the resume text from the file
      const resumeTextResponse = await readFile(formData)
      
      if (resumeTextResponse) {
        setLoadingState('processing')
        console.log(resumeTextResponse)
        // Use LangChain client to process the resume
        try {
          const client = new Client({apiUrl: process.env.NEXT_PUBLIC_LANGCHAIN_URI , apiKey: process.env.NEXT_PUBLIC_LANGCHAIN_API_KEY}) 
          const response = await client.runs.wait(
            null,
            "resume_parser",
            {
              input: {
                "resume_text": resumeTextResponse
              }
            }
          )
          
          // Set the parsed resume from the AI response
          // Use a more generic approach to access the response data
          const responseData = response as any
          
          // Initialize with default empty values for all possible fields
          const parsedData = {
            name: responseData?.parse_resume?.name || '',
            summary: responseData?.parse_resume?.summary || '',
            email: responseData?.parse_resume?.email || '',
            phone_no: responseData?.parse_resume?.phone_no || '',
            address: responseData?.parse_resume?.address || '',
            linkedin_profile: responseData?.parse_resume?.linkedin_profile || '',
            github_profile: responseData?.parse_resume?.github_profile || '',
            website: responseData?.parse_resume?.website || '',
            experiences: (responseData?.parse_resume?.experiences || []).map((exp: any) => ({
              company_name: exp?.company_name || '',
              role: exp?.role || '',
              bulletin: exp?.bulletin || []
            })),
            projects: (responseData?.parse_resume?.projects || []).map((proj: any) => ({
              name: proj?.name || '',
              roles: proj?.roles || []
            })),
            education: responseData?.parse_resume?.education || [],
            certifications: responseData?.parse_resume?.certifications || [],
            awards: responseData?.parse_resume?.awards || [],
            skills: responseData?.parse_resume?.skills || []
          }
          setParsedResume(parsedData)
          setEditedResume(parsedData)
        } catch (error) {
          console.error("Error processing resume with AI:", error)
          toast({
            title: "Processing Error",
            description: "Failed to process resume with AI",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to upload resume",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setLoading(false)
      setLoadingState(null)
    }
  }

  return (
    <section className="h-full pt-10 pb-0 relative overflow-y-auto">
      <div className="h-[45rem] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="text-center relative z-10 mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text"
          >
            Resume Builder
          </motion.h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Upload your resume and our AI will parse it into a structured format that you can edit and use for job applications.
          </p>
          <Link href="/dashboard/resumeAnalysis/create" className="inline-block">
            <Button variant="outline" className="bg-transparent border-emerald-500 text-emerald-500 hover:bg-emerald-500/10">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create from Scratch
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto"
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-center text-white text-2xl">Upload Your Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center hover:border-emerald-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                />
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg mb-2 text-white">Drag and drop your resume here</p>
                <p className="text-sm text-gray-400 mb-4">Supports PDF and DOCX formats</p>
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                  <Upload className="mr-2 h-4 w-4" />
                  Select File
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
} 