"use client"

import { useState, useRef } from 'react'
import { ResumeUploader } from '@/components/ResumeUploader'
import { ResumeLoading } from '@/components/ResumeLoading'
import { ResumeEditor } from '@/components/ResumeEditor'
import { ResumeViewer } from '@/components/ResumeViewer'
import { AIImproveDialog } from '@/components/AIImproveDialog'
import { AIExperienceDialog } from '@/components/AIExperienceDialog'
import { ParsedResume } from '@/types'
import { useToast } from "@/hooks/use-toast"
import { Client } from '@langchain/langgraph-sdk'
import AIResumeHeader from '@/components/AIResumeHeader'
import { TemplateType } from '@/components/TemplateSelector'
import { Download, Loader2 } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function Resume() {
  const [loading, setLoading] = useState(false)
  const [loadingState, setLoadingState] = useState<'uploading' | 'processing' | null>(null)
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null)
  const [editedResume, setEditedResume] = useState<ParsedResume | null>(null)
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
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('classic')
  const [isDownloading, setIsDownloading] = useState(false)

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
    if (!currentAiTarget || !editedResume) return
    
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
  
      if (response.experiences && editedResume) {
        setEditedResume({
          ...editedResume,
          experiences: [
            ...(editedResume.experiences || []),
            ...response.experiences.map(exp => ({
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
      const fileName = editedResume?.name 
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
    <div className="h-screen overflow-hidden bg-gray-900 text-white">
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
      
      {!parsedResume && !loading && (
        <>
          <AIResumeHeader />
          
          <ResumeUploader 
            setLoading={setLoading}
            setLoadingState={setLoadingState}
            setParsedResume={setParsedResume}
            setEditedResume={setEditedResume}
          />
        </>
      )}

      {loading && (
        <ResumeLoading loadingState={loadingState} />
      )}

      {parsedResume && editedResume && !loading && (
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          {/* Editor Panel */}
          <div className="h-full overflow-hidden bg-[#1A2332] border border-gray-700 rounded-lg">
            <ResumeEditor
              editedResume={editedResume}
              setEditedResume={setEditedResume}
              parsedResume={parsedResume}
              handleAiImprove={handleAiImprove}
              setParsedResume={setParsedResume}
              aiLoading={aiLoading}
              onGenerateExperience={() => setExpGenDialog(true)}
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
            />
          </div>
          
          {/* Preview Panel */}
          <div className="h-full overflow-y-auto bg-[#1A2332] border border-gray-700 rounded-lg scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-emerald-500">
            <div className="p-6">
              <div className="sticky top-0 bg-[#1A2332] z-10 pb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-emerald-400">Live Preview</h3>
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-600 disabled:opacity-50 text-white rounded-lg transition-all"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download PDF
                    </>
                  )}
                </button>
              </div>
              <div ref={resumePreviewRef} className="bg-white rounded-lg p-4">
                <ResumeViewer
                  resume={editedResume}
                  selectedTemplate={selectedTemplate}
                />
              </div>
            </div>
          </div>
        </div>
      )}

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