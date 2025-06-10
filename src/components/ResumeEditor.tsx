"use client"

import { useState } from 'react'
import { motion } from "framer-motion"
import { RefreshCw, Save, Sparkles, Loader2, Trash, ChevronDown, ChevronUp, Plus, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { saveResume, getUserResumes, deleteResume as deleteApiResume, ApiResume } from '@/services/resumeApi'
import { getUserProfile } from '@/actions/getUserProfile'
import { ParsedResume } from '@/types'
import { CollapsibleSection } from './CollapsibleSection'
import { Client } from '@langchain/langgraph-sdk'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'
import { TemplateSelector, TemplateType } from './TemplateSelector'

interface ResumeEditorProps {
  editedResume: ParsedResume;
  setEditedResume: (resume: ParsedResume) => void;
  setParsedResume : (resume : ParsedResume | null) => void;
  parsedResume: ParsedResume | null;
  handleAiImprove: (
    type: 'summary' | 'bullet' | 'role', 
    text: string, 
    expIndex?: number, 
    bulletIndex?: number,
    projIndex?: number,
    roleIndex?: number
  ) => void;
  aiLoading: boolean;
  onGenerateExperience: () => void;
  selectedTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
}

export function ResumeEditor({
  editedResume,
  setEditedResume,
  parsedResume,
  handleAiImprove,
  aiLoading,
  onGenerateExperience,
  setParsedResume,
  selectedTemplate,
  onTemplateChange
}: ResumeEditorProps) {
  const { toast } = useToast()
  
  // Collapsible section states
  const [expandedSections, setExpandedSections] = useState({
    experiences: false,
    projects: false,
    education: false,
    certifications: false,
    awards: false,
    skills: false
  })
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  // Collapsible subsection states
  const [expandedSubsections, setExpandedSubsections] = useState({
    experiences: {} as Record<number, boolean>,
    projects: {} as Record<number, boolean>,
    education: {} as Record<number, boolean>,
    certifications: {} as Record<number, boolean>,
    awards: {} as Record<number, boolean>,
    skills: {} as Record<number, boolean>
  })
  const { push } = useRouter()
  const [showAiDialog, setShowAiDialog] = useState(false)
  const [jobDescription, setJobDescription] = useState('')
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [showImproveExpDialog, setShowImproveExpDialog] = useState(false)
  const [improveExpJobDesc, setImproveExpJobDesc] = useState('')
  const [currentExpIndex, setCurrentExpIndex] = useState<number | null>(null)
  const [isImprovingExp, setIsImprovingExp] = useState(false)
  const [showSavedResumesDialog, setShowSavedResumesDialog] = useState(false)
  const [savedResumes, setSavedResumes] = useState<any[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingSavedResumes, setIsLoadingSavedResumes] = useState(false)
  
  // New states for AI project and skills generation
  const [showProjectGenDialog, setShowProjectGenDialog] = useState(false)
  const [showSkillsGenDialog, setShowSkillsGenDialog] = useState(false)
  const [projectGenJobDesc, setProjectGenJobDesc] = useState('')
  const [skillsGenJobDesc, setSkillsGenJobDesc] = useState('')
  const [isGeneratingProject, setIsGeneratingProject] = useState(false)
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false)
  
  const improveExperience = async (jobDescription: string) => {
    const client = new Client({
      apiKey: process.env.NEXT_PUBLIC_LANGCHAIN_API_KEY,
      apiUrl: process.env.NEXT_PUBLIC_LANGCHAIN_URI
    })
    const response  = await client.runs.wait(
      null,
      "exp_improver",
      {
        input: {
          "job_desc": jobDescription
        }
      }
    )
    const responseData = response as any
    return responseData.responsibilities
  }
  const generateSummary = async (jobDescription: string) => {
    try {
      setIsGeneratingSummary(true)
      const client = new Client({
        apiKey: process.env.NEXT_PUBLIC_LANGCHAIN_API_KEY,
        apiUrl: process.env.NEXT_PUBLIC_LANGCHAIN_URI
      })
      
      const response = await client.runs.wait(
        null,
        "summary_builder",
        {
          input: {
            "job_description": jobDescription
          }
        }
      )
      const responseData = response as any
      const generatedSummary = responseData.generated_summary
      setAiSummary(generatedSummary)
      return generatedSummary
    } catch (error) {
      console.error('Error generating summary:', error)
      throw error
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }
  
  const toggleSubsection = (section: keyof typeof expandedSubsections, index: number) => {
    setExpandedSubsections(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [index]: !prev[section][index]
      }
    }))
  }

  const handleSaveResume = async () => {
    try {
      setIsSaving(true)
      const resumeName = editedResume.name || 'Untitled Resume'
      
      // Save to database using API
      await saveResume({
        name: resumeName,
        resume: editedResume,
        template: selectedTemplate,
      })
      
      toast({
        title: "Success",
        description: "Resume saved successfully",
      })
    } catch (error) {
      console.error('Error saving resume:', error)
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getSavedResumes = async () => {
    try {
      // Load from database
      const userProfile = await getUserProfile()
      const dbResumes = await getUserResumes(userProfile.id)
      
      // Format database resumes
      return dbResumes.map((resume: ApiResume) => ({
        ...resume,
        title: resume.name
      }))
    } catch (error) {
      console.error('Error loading saved resumes:', error)
      return []
    }
  }

  const handleResetChanges = () => {
    setEditedResume(parsedResume as ParsedResume)
  }

  const handleGenerateAiSummary = async () => {
    if (!jobDescription) return
    
    try {
      const generatedSummary = await generateSummary(jobDescription)
      setShowAiDialog(false)
      if (generatedSummary) {
        setEditedResume({...editedResume, summary: generatedSummary})
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleImproveExperience = async () => {
    if (!improveExpJobDesc || currentExpIndex === null) return
    
    try {
      setIsImprovingExp(true)
      const responsibilities = await improveExperience(improveExpJobDesc)
      
      if (responsibilities && editedResume.experiences) {
        const updatedExperiences = [...editedResume.experiences]
        const currentExp = updatedExperiences[currentExpIndex]
        
        // Add the new responsibilities to existing bulletin points
        updatedExperiences[currentExpIndex] = {
          ...currentExp,
          bulletin: [...currentExp.bulletin, ...responsibilities]
        }
        
        setEditedResume({
          ...editedResume,
          experiences: updatedExperiences
        })
        
        toast({
          title: "Success",
          description: "Experience improved with AI-generated responsibilities",
        })
      }
      
      setShowImproveExpDialog(false)
      setImproveExpJobDesc('')
      setCurrentExpIndex(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to improve experience. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsImprovingExp(false)
    }
  }

  const openImproveExpDialog = (expIndex: number) => {
    setCurrentExpIndex(expIndex)
    setShowImproveExpDialog(true)
  }

  // Experience editing functions
  const updateExperience = (index: number, field: string, value: any) => {
    if (!editedResume || !editedResume.experiences) return
    
    const updatedExperiences = [...editedResume.experiences]
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value
    }
    
    setEditedResume({
      ...editedResume,
      experiences: updatedExperiences
    })
  }

  const updateBulletin = (expIndex: number, bulletIndex: number, value: string) => {
    if (!editedResume || !editedResume.experiences) return
    
    const updatedExperiences = [...editedResume.experiences]
    const updatedBulletin = [...updatedExperiences[expIndex].bulletin]
    updatedBulletin[bulletIndex] = value
    
    updatedExperiences[expIndex] = {
      ...updatedExperiences[expIndex],
      bulletin: updatedBulletin
    }
    
    setEditedResume({
      ...editedResume,
      experiences: updatedExperiences
    })
  }

  const addBulletPoint = (expIndex: number) => {
    if (!editedResume || !editedResume.experiences) return
    
    const updatedExperiences = [...editedResume.experiences]
    updatedExperiences[expIndex] = {
      ...updatedExperiences[expIndex],
      bulletin: [...updatedExperiences[expIndex].bulletin, ""]
    }
    
    setEditedResume({
      ...editedResume,
      experiences: updatedExperiences
    })
  }

  const removeBulletPoint = (expIndex: number, bulletIndex: number) => {
    if (!editedResume || !editedResume.experiences) return
    
    const updatedExperiences = [...editedResume.experiences]
    const updatedBulletin = [...updatedExperiences[expIndex].bulletin]
    updatedBulletin.splice(bulletIndex, 1)
    
    updatedExperiences[expIndex] = {
      ...updatedExperiences[expIndex],
      bulletin: updatedBulletin
    }
    
    setEditedResume({
      ...editedResume,
      experiences: updatedExperiences
    })
  }

  const removeExperience = (expIndex: number) => {
    if (!editedResume || !editedResume.experiences) return
    
    const updatedExperiences = [...editedResume.experiences]
    updatedExperiences.splice(expIndex, 1)
    
    setEditedResume({
      ...editedResume,
      experiences: updatedExperiences
    })
  }

  // Project editing functions
  const updateProject = (index: number, field: string, value: any) => {
    if (!editedResume || !editedResume.projects) return
    
    const updatedProjects = [...editedResume.projects]
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value
    }
    
    setEditedResume({
      ...editedResume,
      projects: updatedProjects
    })
  }

  const updateProjectRole = (projIndex: number, roleIndex: number, value: string) => {
    if (!editedResume || !editedResume.projects) return
    
    const updatedProjects = [...editedResume.projects]
    const updatedRoles = [...updatedProjects[projIndex].roles]
    updatedRoles[roleIndex] = value
    
    updatedProjects[projIndex] = {
      ...updatedProjects[projIndex],
      roles: updatedRoles
    }
    
    setEditedResume({
      ...editedResume,
      projects: updatedProjects
    })
  }

  const addProjectRole = (projIndex: number) => {
    if (!editedResume || !editedResume.projects) return
    
    const updatedProjects = [...editedResume.projects]
    updatedProjects[projIndex] = {
      ...updatedProjects[projIndex],
      roles: [...updatedProjects[projIndex].roles, ""]
    }
    
    setEditedResume({
      ...editedResume,
      projects: updatedProjects
    })
  }

  const removeProjectRole = (projIndex: number, roleIndex: number) => {
    if (!editedResume || !editedResume.projects) return
    
    const updatedProjects = [...editedResume.projects]
    const updatedRoles = [...updatedProjects[projIndex].roles]
    updatedRoles.splice(roleIndex, 1)
    
    updatedProjects[projIndex] = {
      ...updatedProjects[projIndex],
      roles: updatedRoles
    }
    
    setEditedResume({
      ...editedResume,
      projects: updatedProjects
    })
  }

  const removeProject = (projIndex: number) => {
    if (!editedResume || !editedResume.projects) return
    
    const updatedProjects = [...editedResume.projects]
    updatedProjects.splice(projIndex, 1)
    
    setEditedResume({
      ...editedResume,
      projects: updatedProjects
    })
  }

  // Add new item functions
  const addNewExperience = () => {
    if (!editedResume) return
    
    const newExperience = {
      company_name: "",
      role: "",
      bulletin: [""]
    }
    
    setEditedResume({
      ...editedResume,
      experiences: [...(editedResume.experiences || []), newExperience]
    })
  }

  const addNewProject = () => {
    if (!editedResume) return
    
    const newProject = {
      name: "",
      roles: [""]
    }
    
    setEditedResume({
      ...editedResume,
      projects: [...(editedResume.projects || []), newProject]
    })
  }
  
  const addNewEducation = () => {
    if (!editedResume) return
    
    setEditedResume({
      ...editedResume,
      education: [...(editedResume.education || []), ""]
    })
  }
  
  const updateEducation = (index: number, value: string) => {
    if (!editedResume || !editedResume.education) return
    
    const updatedEducation = [...editedResume.education]
    updatedEducation[index] = value
    
    setEditedResume({
      ...editedResume,
      education: updatedEducation
    })
  }
  
  const removeEducation = (index: number) => {
    if (!editedResume || !editedResume.education) return
    
    const updatedEducation = [...editedResume.education]
    updatedEducation.splice(index, 1)
    
    setEditedResume({
      ...editedResume,
      education: updatedEducation
    })
  }
  
  const addNewCertification = () => {
    if (!editedResume) return
    
    setEditedResume({
      ...editedResume,
      certifications: [...(editedResume.certifications || []), ""]
    })
  }
  
  const updateCertification = (index: number, value: string) => {
    if (!editedResume || !editedResume.certifications) return
    
    const updatedCertifications = [...editedResume.certifications]
    updatedCertifications[index] = value
    
    setEditedResume({
      ...editedResume,
      certifications: updatedCertifications
    })
  }
  
  const removeCertification = (index: number) => {
    if (!editedResume || !editedResume.certifications) return
    
    const updatedCertifications = [...editedResume.certifications]
    updatedCertifications.splice(index, 1)
    
    setEditedResume({
      ...editedResume,
      certifications: updatedCertifications
    })
  }
  
  const addNewAward = () => {
    if (!editedResume) return
    
    setEditedResume({
      ...editedResume,
      awards: [...(editedResume.awards || []), ""]
    })
  }
  
  const updateAward = (index: number, value: string) => {
    if (!editedResume || !editedResume.awards) return
    
    const updatedAwards = [...editedResume.awards]
    updatedAwards[index] = value
    
    setEditedResume({
      ...editedResume,
      awards: updatedAwards
    })
  }
  
  const removeAward = (index: number) => {
    if (!editedResume || !editedResume.awards) return
    
    const updatedAwards = [...editedResume.awards]
    updatedAwards.splice(index, 1)
    
    setEditedResume({
      ...editedResume,
      awards: updatedAwards
    })
  }

  const addNewSkill = () => {
    if (!editedResume) return
    
    setEditedResume({
      ...editedResume,
      skills: [...(editedResume.skills || []), ""]
    })
  }
  
  const updateSkill = (index: number, value: string) => {
    if (!editedResume || !editedResume.skills) return
    
    const updatedSkills = [...editedResume.skills]
    updatedSkills[index] = value
    
    setEditedResume({
      ...editedResume,
      skills: updatedSkills
    })
  }
  
  const removeSkill = (index: number) => {
    if (!editedResume || !editedResume.skills) return
    
    const updatedSkills = [...editedResume.skills]
    updatedSkills.splice(index, 1)
    
    setEditedResume({
      ...editedResume,
      skills: updatedSkills
    })
  }

  // AI-powered project generation
  const handleGenerateProject = async (jobDescription: string) => {
    try {
      setIsGeneratingProject(true)
      
      const client = new Client({ 
        apiUrl: process.env.NEXT_PUBLIC_LANGCHAIN_URI, 
        apiKey: process.env.NEXT_PUBLIC_LANGCHAIN_API_KEY 
      })
      
      const response = await client.runs.wait(
        null,
        "project_gen",
        {
          input: {
            job_desc: jobDescription
          }
        }
      )

      const responseData = response as any
      if (responseData.project) {
        const newProject = {
          name: responseData.project.name,
          roles: responseData.project.roles
        }
        
        setEditedResume({
          ...editedResume,
          projects: [...(editedResume.projects || []), newProject]
        })
        
        toast({
          title: "Success",
          description: "AI-generated project added successfully",
        })
      }
      
      setShowProjectGenDialog(false)
      setProjectGenJobDesc('')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate project. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingProject(false)
    }
  }

  // AI-powered skills generation
  const handleGenerateSkills = async (jobDescription: string) => {
    try {
      setIsGeneratingSkills(true)
      
      const client = new Client({ 
        apiUrl: process.env.NEXT_PUBLIC_LANGCHAIN_URI, 
        apiKey: process.env.NEXT_PUBLIC_LANGCHAIN_API_KEY 
      })
      
      const response = await client.runs.wait(
        null,
        "skills_gen",
        {
          input: {
            job_desc: jobDescription
          }
        }
      )

      const responseData = response as any
      if (responseData.skills) {
        // Add new skills to existing ones, avoiding duplicates
        const existingSkills = editedResume.skills || []
        const newSkills = responseData.skills.filter((skill: string) => 
          !existingSkills.some((existing: string) => 
            existing.toLowerCase() === skill.toLowerCase()
          )
        )
        
        setEditedResume({
          ...editedResume,
          skills: [...existingSkills, ...newSkills]
        })
        
        toast({
          title: "Success",
          description: `${newSkills.length} AI-generated skills added successfully`,
        })
      }
      
      setShowSkillsGenDialog(false)
      setSkillsGenJobDesc('')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate skills. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingSkills(false)
    }
  }

  return (
        <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col h-full overflow-hidden no-print"
    >
      <div className="flex justify-between items-center p-6 pb-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setParsedResume(null)
              push('/dashboard/resumeAnalysis')
            }}
            className="text-gray-400 hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-bold text-white">Edit Resume</h2>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResetChanges}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button 
            size="sm"
            onClick={handleSaveResume}
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600 disabled:opacity-50 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Resume
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={async () => {
              setIsLoadingSavedResumes(true)
              try {
                const resumes = await getSavedResumes()
                setSavedResumes(resumes)
                setShowSavedResumesDialog(true)
              } catch (error) {
                toast({
                  title: "Error",
                  description: "Failed to load saved resumes. Please try again.",
                  variant: "destructive"
                })
              } finally {
                setIsLoadingSavedResumes(false)
              }
            }}
            disabled={isLoadingSavedResumes}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
          >
            {isLoadingSavedResumes ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'View Saved'
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 bg-gray-900 p-6">
          {/* Template Selector */}
          <TemplateSelector 
            selectedTemplate={selectedTemplate} 
            onTemplateChange={onTemplateChange} 
          />
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={editedResume.name}
              onChange={(e) => setEditedResume({...editedResume, name: e.target.value})}
              className="bg-gray-700 border-gray-600"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                value={editedResume.email || ''}
                onChange={(e) => setEditedResume({...editedResume, email: e.target.value})}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input
                value={editedResume.phone_no || ''}
                onChange={(e) => setEditedResume({...editedResume, phone_no: e.target.value})}
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn</label>
              <Input
                value={editedResume.linkedin_profile || ''}
                onChange={(e) => setEditedResume({...editedResume, linkedin_profile: e.target.value})}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GitHub</label>
              <Input
                value={editedResume.github_profile || ''}
                onChange={(e) => setEditedResume({...editedResume, github_profile: e.target.value})}
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <Input
              value={editedResume.address || ''}
              onChange={(e) => {
                if (e.target.value.length <= 100) {
                  setEditedResume({...editedResume, address: e.target.value})
                }
              }}
              className="bg-gray-700 border-gray-600"
              maxLength={100}
            />
            <p className="text-xs text-gray-400 mt-1">Max 100 characters ({100 - (editedResume.address?.length || 0)} remaining)</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Summary</label>
            <div className="relative">
              <Textarea
                value={editedResume.summary}
                onChange={(e) => setEditedResume({...editedResume, summary: e.target.value})}
                className="bg-gray-700 border-gray-600 min-h-[100px] pr-24"
              />
              <div className="absolute right-2 top-2 flex gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setShowAiDialog(true)}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate with AI
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-emerald-400 hover:text-emerald-300"
                  onClick={() => handleAiImprove('summary', editedResume.summary || '')}
                  disabled={!editedResume.summary || editedResume.summary.length < 10 || aiLoading}
                >
                  {aiLoading ? 
                    <Loader2 className="h-4 w-4 animate-spin" /> : 
                    <Sparkles className={`h-4 w-4 ${!editedResume.summary || editedResume.summary.length < 10 ? 'opacity-50' : ''}`} />
                  }
                </Button>
              </div>
            </div>
          </div>
          
          {/* Experiences Section */}
          <CollapsibleSection
            title="Experience"
            isExpanded={expandedSections.experiences}
            toggleExpanded={() => toggleSection('experiences')}
            addItem={addNewExperience}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Work Experience</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onGenerateExperience}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <span className="mr-2">✨</span>
                  Generate with AI
                </Button>
              </div>
              {editedResume.experiences?.map((exp, expIndex) => (
                <div key={expIndex} className="mb-4 p-4 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium text-gray-300">Experience #{expIndex + 1}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openImproveExpDialog(expIndex)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Improve Experience
                    </Button>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="block text-xs font-medium mb-1">Company</label>
                        <Input
                          value={exp.company_name}
                          onChange={(e) => updateExperience(expIndex, 'company_name', e.target.value)}
                          className="bg-gray-600 border-gray-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Role</label>
                        <Input
                          value={exp.role}
                          onChange={(e) => updateExperience(expIndex, 'role', e.target.value)}
                          className="bg-gray-600 border-gray-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSubsection('experiences', expIndex)}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        {expandedSubsections.experiences[expIndex] ? 
                          <ChevronUp className="h-5 w-5" /> : 
                          <ChevronDown className="h-5 w-5" />
                        }
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeExperience(expIndex)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {expandedSubsections.experiences[expIndex] && (
                    <div>
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-medium mb-1">Responsibilities</label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => addBulletPoint(expIndex)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                      {exp.bulletin.map((bullet, bulletIndex) => (
                        <div key={bulletIndex} className="mb-2 flex items-center gap-2">
                          <div className="relative flex-1">
                            <Input
                              value={bullet}
                              onChange={(e) => updateBulletin(expIndex, bulletIndex, e.target.value)}
                              className="bg-gray-600 border-gray-500 pr-8 break-words"
                            />
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="absolute right-1 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-300 h-6 w-6 p-0"
                              onClick={() => handleAiImprove('bullet', bullet || '', expIndex, bulletIndex)}
                              disabled={!bullet || bullet.length < 10 || aiLoading}
                            >
                              {aiLoading ? 
                                <Loader2 className="h-3 w-3 animate-spin" /> : 
                                <Sparkles className={`h-3 w-3 ${!bullet || bullet.length < 10 ? 'opacity-50' : ''}`} />
                              }
                            </Button>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeBulletPoint(expIndex, bulletIndex)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CollapsibleSection>
          
          {/* Education Section */}
          <CollapsibleSection
            title="Education"
            isExpanded={expandedSections.education}
            toggleExpanded={() => toggleSection('education')}
            addItem={addNewEducation}
          >
            {editedResume.education?.map((edu, eduIndex) => (
              <div key={eduIndex} className="mb-2 flex items-center gap-2">
                <Input
                  value={edu}
                  onChange={(e) => updateEducation(eduIndex, e.target.value)}
                  className="bg-gray-600 border-gray-500"
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeEducation(eduIndex)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </CollapsibleSection>
          
          {/* Certifications Section */}
          <CollapsibleSection
            title="Certifications"
            isExpanded={expandedSections.certifications}
            toggleExpanded={() => toggleSection('certifications')}
            addItem={addNewCertification}
          >
            {editedResume.certifications?.map((cert, certIndex) => (
              <div key={certIndex} className="mb-2 flex items-center gap-2">
                <Input
                  value={cert}
                  onChange={(e) => updateCertification(certIndex, e.target.value)}
                  className="bg-gray-600 border-gray-500"
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeCertification(certIndex)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </CollapsibleSection>
          
          {/* Awards Section */}
          <CollapsibleSection
            title="Awards"
            isExpanded={expandedSections.awards}
            toggleExpanded={() => toggleSection('awards')}
            addItem={addNewAward}
          >
            {editedResume.awards?.map((award, awardIndex) => (
              <div key={awardIndex} className="mb-2 flex items-center gap-2">
                <Input
                  value={award}
                  onChange={(e) => updateAward(awardIndex, e.target.value)}
                  className="bg-gray-600 border-gray-500"
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeAward(awardIndex)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </CollapsibleSection>
          
          {/* Skills Section */}
          <CollapsibleSection
            title="Skills"
            isExpanded={expandedSections.skills}
            toggleExpanded={() => toggleSection('skills')}
            addItem={addNewSkill}
          >
            <div className="mb-4 flex justify-between items-center">
              <span className="text-sm text-gray-400">Manage your technical and soft skills</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSkillsGenDialog(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600 hover:border-purple-700"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Skills with AI
              </Button>
            </div>
            {editedResume.skills?.map((skill, skillIndex) => (
              <div key={skillIndex} className="mb-2 flex items-center gap-2">
                <Input
                  value={skill}
                  onChange={(e) => updateSkill(skillIndex, e.target.value)}
                  className="bg-gray-600 border-gray-500"
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeSkill(skillIndex)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </CollapsibleSection>
          
          {/* Projects Section */}
          <CollapsibleSection
            title="Projects"
            isExpanded={expandedSections.projects}
            toggleExpanded={() => toggleSection('projects')}
            addItem={addNewProject}
          >
            <div className="mb-4 flex justify-between items-center">
              <span className="text-sm text-gray-400">Showcase your projects and achievements</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProjectGenDialog(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 hover:border-indigo-700"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Project with AI
              </Button>
            </div>
            {editedResume.projects?.map((project, projIndex) => (
              <div key={projIndex} className="mb-4 p-4 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => toggleSubsection('projects', projIndex)}
                  >
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-medium mb-1">Project Name</label>
                      <div>
                        {expandedSubsections.projects[projIndex] ? 
                          <ChevronUp className="h-5 w-5" /> : 
                          <ChevronDown className="h-5 w-5" />
                        }
                      </div>
                    </div>
                    <Input
                      value={project.name}
                      onChange={(e) => updateProject(projIndex, 'name', e.target.value)}
                      className="bg-gray-600 border-gray-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeProject(projIndex)}
                      className="text-red-400 hover:text-red-300"
                      title="Delete Project"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {expandedSubsections.projects[projIndex] && (
                  <div>
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-medium mb-1">Roles</label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => addProjectRole(projIndex)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                    {project.roles.map((role, roleIndex) => (
                      <div key={roleIndex} className="mb-2 flex items-center gap-2">
                        <div className="relative flex-1">
                          <Input
                            value={role}
                            onChange={(e) => updateProjectRole(projIndex, roleIndex, e.target.value)}
                            className="bg-gray-600 border-gray-500 pr-8 break-words"
                          />
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-300 h-6 w-6 p-0"
                            onClick={() => handleAiImprove('role', role || '', undefined, undefined, projIndex, roleIndex)}
                            disabled={!role || role.length < 10 || aiLoading}
                          >
                            {aiLoading ? 
                              <Loader2 className="h-3 w-3 animate-spin" /> : 
                              <Sparkles className={`h-3 w-3 ${!role || role.length < 10 ? 'opacity-50' : ''}`} />
                            }
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeProjectRole(projIndex, roleIndex)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CollapsibleSection>
        </div>
      </div>

      <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Generate AI Summary</DialogTitle>
            <DialogDescription>
              Enter the job description to generate a tailored summary for your resume.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="min-h-[200px]"
              disabled={isGeneratingSummary}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleGenerateAiSummary}
              disabled={!jobDescription || isGeneratingSummary}
            >
              {isGeneratingSummary ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Summary...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Summary
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showImproveExpDialog} onOpenChange={setShowImproveExpDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Improve Experience with AI</DialogTitle>
            <DialogDescription>
              Enter the job description to generate tailored responsibilities for this experience.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Job Description
              </label>
              <Textarea
                value={improveExpJobDesc}
                onChange={(e) => setImproveExpJobDesc(e.target.value)}
                placeholder="Paste the job description you're targeting..."
                className="min-h-[200px]"
                disabled={isImprovingExp}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowImproveExpDialog(false)
                setImproveExpJobDesc('')
                setCurrentExpIndex(null)
              }}
              disabled={isImprovingExp}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImproveExperience}
              disabled={!improveExpJobDesc || isImprovingExp}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isImprovingExp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Improving Experience...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Improve Experience
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSavedResumesDialog} onOpenChange={setShowSavedResumesDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[600px] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Saved Resumes</DialogTitle>
            <DialogDescription>
              Load a previously saved resume from your database.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
            {isLoadingSavedResumes ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-emerald-500" />
                <p className="text-gray-500">Loading saved resumes...</p>
              </div>
            ) : savedResumes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No saved resumes found.</p>
                <p className="text-sm mt-2">Save a resume to see it here.</p>
              </div>
            ) : (
              savedResumes.map((savedResume, index) => (
                <div key={savedResume.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                                          <div className="flex-1">
                        <h3 className="font-semibold text-lg">{savedResume.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">Template: {savedResume.template}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Saved: {new Date(savedResume.last_modified).toLocaleDateString()} at {new Date(savedResume.last_modified).toLocaleTimeString()}
                        </p>
                        {savedResume.resume?.email && (
                          <p className="text-xs text-gray-500">{savedResume.resume.email}</p>
                        )}
                      </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditedResume(savedResume.resume)
                          onTemplateChange(savedResume.template)
                          setShowSavedResumesDialog(false)
                          toast({
                            title: "Success",
                            description: `Resume "${savedResume.name}" loaded successfully`,
                          })
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Load
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          try {
                            // Delete from database
                            await deleteApiResume(savedResume.id)
                            
                            // Update state
                            const updatedResumes = savedResumes.filter(r => r.id !== savedResume.id)
                            setSavedResumes(updatedResumes)
                            
                            toast({
                              title: "Deleted",
                              description: `Resume "${savedResume.name}" deleted`,
                            })
                          } catch (error) {
                            toast({
                              title: "Error",
                              description: "Failed to delete resume. Please try again.",
                              variant: "destructive"
                            })
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSavedResumesDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Project Generation Dialog */}
      <Dialog open={showProjectGenDialog} onOpenChange={setShowProjectGenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Project with AI</DialogTitle>
            <DialogDescription>
              Enter a job description to generate a tailored project for your resume.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Job Description
              </label>
              <Textarea
                value={projectGenJobDesc}
                onChange={(e) => setProjectGenJobDesc(e.target.value)}
                placeholder="Paste the job description you're targeting..."
                className="min-h-[200px] bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-indigo-500"
                disabled={isGeneratingProject}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowProjectGenDialog(false)
                setProjectGenJobDesc('')
              }}
              disabled={isGeneratingProject}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleGenerateProject(projectGenJobDesc)}
              disabled={!projectGenJobDesc || isGeneratingProject}
              className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 disabled:bg-gray-500 disabled:text-gray-300"
            >
              {isGeneratingProject ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Project...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Project
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Skills Generation Dialog */}
      <Dialog open={showSkillsGenDialog} onOpenChange={setShowSkillsGenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Skills with AI</DialogTitle>
            <DialogDescription>
              Enter a job description to generate relevant skills for your resume.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Job Description
              </label>
              <Textarea
                value={skillsGenJobDesc}
                onChange={(e) => setSkillsGenJobDesc(e.target.value)}
                placeholder="Paste the job description you're targeting..."
                className="min-h-[200px] bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500"
                disabled={isGeneratingSkills}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowSkillsGenDialog(false)
                setSkillsGenJobDesc('')
              }}
              disabled={isGeneratingSkills}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleGenerateSkills(skillsGenJobDesc)}
              disabled={!skillsGenJobDesc || isGeneratingSkills}
              className="bg-purple-600 hover:bg-purple-700 text-white border-0 disabled:bg-gray-500 disabled:text-gray-300"
            >
              {isGeneratingSkills ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Skills...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Skills
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}