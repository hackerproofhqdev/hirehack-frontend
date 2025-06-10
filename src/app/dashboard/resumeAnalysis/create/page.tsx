"use client"

import { useRef, useState, useEffect } from 'react'
import { ParsedResume } from '@/types'
import { useToast } from "@/hooks/use-toast"
import { Client } from "@langchain/langgraph-sdk"
import { ResumeEditor } from '@/components/ResumeEditor'
import { ResumeViewer } from '@/components/ResumeViewer'
import { TemplateType } from '@/components/TemplateSelector'
import { AIImproveDialog } from '@/components/AIImproveDialog'
import { AIExperienceDialog } from '@/components/AIExperienceDialog'
import { ArrowLeft, Download, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function CreateResume() {
  const router = useRouter()
  const [editedResume, setEditedResume] = useState<ParsedResume>({
    name: '',
    summary: '',
    email: '',
    phone_no: '',
    address: '',
    linkedin_profile: '',
    github_profile: '',
    website: '',
    experiences: [],
    projects: [],
    education: [],
    certifications: [],
    awards: [],
    skills: []
  })
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('classic')
  const [isDownloading, setIsDownloading] = useState(false)
  const resumePreviewRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const [aiLoading, setAiLoading] = useState(false)
  const [aiDialog, setAiDialog] = useState(false)
  const [aiImprovedVersions, setAiImprovedVersions] = useState<{
    improve_version1: string | null;
    improve_version2: string | null;
    improve_version3: string | null;
  } | null>(null)
  const [currentAiTarget, setCurrentAiTarget] = useState<{
    type: 'summary' | 'bullet' | 'role';
    text: string;
    expIndex?: number;
    bulletIndex?: number;
    projIndex?: number;
    roleIndex?: number;
  } | null>(null)

  const [expGenDialog, setExpGenDialog] = useState(false)
  const [expGenLoading, setExpGenLoading] = useState(false)

  const handleAiImprove = async (
    type: 'summary' | 'bullet' | 'role', 
    text: string, 
    expIndex?: number, 
    bulletIndex?: number,
    projIndex?: number,
    roleIndex?: number
  ) => {
    setAiLoading(true)
    setCurrentAiTarget({ type, text, expIndex, bulletIndex, projIndex, roleIndex })
    setAiDialog(true)
    setAiImprovedVersions(null) // Reset previous versions
  }

  const applyAiImprovement = (version: string) => {
    if (!currentAiTarget) return
    
    switch (currentAiTarget.type) {
      case 'summary':
        setEditedResume({
          ...editedResume,
          summary: version
        })
        break
      case 'bullet':
        if (typeof currentAiTarget.expIndex === 'number' && 
            typeof currentAiTarget.bulletIndex === 'number' && 
            editedResume.experiences) {
          const updatedExperiences = [...editedResume.experiences]
          const updatedBulletin = [...updatedExperiences[currentAiTarget.expIndex].bulletin]
          updatedBulletin[currentAiTarget.bulletIndex] = version
          
          updatedExperiences[currentAiTarget.expIndex] = {
            ...updatedExperiences[currentAiTarget.expIndex],
            bulletin: updatedBulletin
          }
          
          setEditedResume({
            ...editedResume,
            experiences: updatedExperiences
          })
        }
        break
      case 'role':
        if (typeof currentAiTarget.projIndex === 'number' && 
            typeof currentAiTarget.roleIndex === 'number' && 
            editedResume.projects) {
          const updatedProjects = [...editedResume.projects]
          const updatedRoles = [...updatedProjects[currentAiTarget.projIndex].roles]
          updatedRoles[currentAiTarget.roleIndex] = version
          
          updatedProjects[currentAiTarget.projIndex] = {
            ...updatedProjects[currentAiTarget.projIndex],
            roles: updatedRoles
          }
          
          setEditedResume({
            ...editedResume,
            projects: updatedProjects
          })
        }
        break
    }
    
    setAiDialog(false)
    setAiImprovedVersions(null)
    setCurrentAiTarget(null)
    setAiLoading(false)
    
    toast({
      title: "Success",
      description: "AI improvement applied successfully",
    })
  }

  const handleGenerateExperience = async (jobDescription: string, companies: string[]) => {
    try {
      setExpGenLoading(true)
      
      const client = new Client({ apiUrl: process.env.NEXT_PUBLIC_LANGCHAIN_URI , apiKey: process.env.NEXT_PUBLIC_LANGCHAIN_API_KEY })
      
      const response = await client.runs.wait(
        null,
        "experience_builder",
        {
          input: {
            job_description: jobDescription,
            company_names: companies
          }
        }
      )
  
      const responseData = response as any
      if (responseData.experiences) {
        setEditedResume({
          ...editedResume,
          experiences: [
            ...(editedResume.experiences || []),
            ...responseData.experiences.map((exp: any) => ({
              ...exp,
              bulletin: exp.bulletin || []
            }))
          ]
        })
        
        toast({
          title: "Success",
          description: "Work experiences generated successfully",
        })
      }
      
      setExpGenDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate experiences",
        variant: "destructive"
      })
    } finally {
      setExpGenLoading(false)
    }
  }

  const setParsedResume = (resume: ParsedResume | null) => {
    if (resume) {
      setEditedResume(resume)
    }
  }

  // Check if there's data to load from sessionStorage on mount
  useEffect(() => {
    const loadData = sessionStorage.getItem('loadResumeData')
    if (loadData) {
      try {
        const { resume, template } = JSON.parse(loadData)
        setEditedResume(resume)
        setSelectedTemplate(template || 'classic')
        sessionStorage.removeItem('loadResumeData') // Clean up
        toast({
          title: "Resume Loaded",
          description: "Resume data loaded successfully",
        })
      } catch (error) {
        console.error("Error loading resume data:", error)
      }
    }
  }, [])

  const handleDownloadPDF = async () => {
    if (!resumePreviewRef.current) {
      toast({
        title: "Error",
        description: "Resume preview not available for download",
        variant: "destructive"
      })
      return
    }

    setIsDownloading(true)
    
    try {
      // Get the resume container
      const resumeElement = resumePreviewRef.current
      
      // Create canvas from the resume element
      const canvas = await html2canvas(resumeElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: resumeElement.scrollWidth,
        height: resumeElement.scrollHeight,
        windowWidth: resumeElement.scrollWidth,
        windowHeight: resumeElement.scrollHeight
      })

      // Calculate dimensions for A4 page
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/png')
      
      let heightLeft = imgHeight
      let position = 0

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Generate filename
      const fileName = editedResume.name 
        ? `${editedResume.name.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.pdf`
        : `Resume_${selectedTemplate}_${new Date().getTime()}.pdf`

      // Download the PDF
      pdf.save(fileName)

      toast({
        title: "Success",
        description: "Resume downloaded successfully",
      })
    } catch (error) {
      console.error("Error downloading resume:", error)
      toast({
        title: "Error",
        description: "Failed to download resume. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="h-screen bg-[#0F1729] text-gray-300 flex flex-col overflow-hidden">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0.5cm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-color: white !important;
            color: black !important;
          }
          .print-only {
            display: block;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      
      {/* Header with Back Button */}
      <div className="shrink-0 p-3 sm:p-4 border-b border-gray-700">
        <button
          onClick={() => router.push('/dashboard/resumeAnalysis')}
          className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Back to Resume Analysis</span>
          <span className="sm:hidden">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full w-full p-2 sm:p-4">
          <div className="h-full flex flex-col lg:grid lg:grid-cols-2 gap-2 sm:gap-4">
            {/* Editor Panel */}
            <div className="h-1/2 lg:h-full overflow-hidden bg-[#1A2332] border border-gray-700 rounded-lg order-2 lg:order-1">
              <ResumeEditor
                editedResume={editedResume}
                setEditedResume={setEditedResume}
                parsedResume={editedResume}
                handleAiImprove={handleAiImprove}
                setParsedResume={setParsedResume}
                aiLoading={aiLoading}
                onGenerateExperience={() => setExpGenDialog(true)}
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
              />
            </div>
            
            {/* Preview Panel */}
            <div className="h-1/2 lg:h-full overflow-y-auto bg-[#1A2332] border border-gray-700 rounded-lg scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-emerald-500 order-1 lg:order-2">
              <div className="p-3 sm:p-6">
                <div className="sticky top-0 bg-[#1A2332] z-10 pb-3 sm:pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <h3 className="text-base sm:text-lg font-semibold text-emerald-400">Live Preview</h3>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-600 disabled:opacity-50 text-white rounded-lg transition-all text-sm sm:text-base w-full sm:w-auto justify-center"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="hidden sm:inline">Downloading...</span>
                        <span className="sm:hidden">Download...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Download PDF</span>
                        <span className="sm:hidden">PDF</span>
                      </>
                    )}
                  </button>
                </div>
                <div ref={resumePreviewRef} className="bg-white rounded-lg p-2 sm:p-4">
                  <ResumeViewer
                    resume={editedResume}
                    selectedTemplate={selectedTemplate}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Improvement Dialog */}
      <AIImproveDialog
        open={aiDialog}
        setOpen={setAiDialog}
        currentTarget={currentAiTarget}
        setCurrentTarget={setCurrentAiTarget}
        improvedVersions={aiImprovedVersions}
        setImprovedVersions={setAiImprovedVersions}
        applyImprovement={applyAiImprovement}
      />

      <AIExperienceDialog
        open={expGenDialog}
        setOpen={setExpGenDialog}
        onGenerate={handleGenerateExperience}
        loading={expGenLoading}
      />
    </div>
  )
} 