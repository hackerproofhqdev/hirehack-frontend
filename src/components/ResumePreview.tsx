"use client"

import { forwardRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Printer, Loader2 } from "lucide-react"
import { ParsedResume } from '@/types'
import { useToast } from "@/hooks/use-toast"

interface ResumePreviewProps {
  editedResume: ParsedResume
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ editedResume }, ref) => {
    const [printLoading, setPrintLoading] = useState(false)
    const { toast } = useToast()

    const handlePrintResume = () => {
      setPrintLoading(true)
      
      try {
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          throw new Error("Could not open print window");
        }
        
        // Get the resume content
        const resumeContent = ref && 'current' in ref && ref.current ? ref.current.innerHTML : '';
        
        // Create a complete HTML document with proper styling
        const printContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>${editedResume?.name || 'Resume'}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: white;
                color: #111827;
              }
              .resume-container {
                max-width: 210mm;
                margin: 0 auto;
                padding: 0;
              }
              .bg-white {
                background-color: white;
              }
              .text-gray-900 {
                color: #111827;
              }
              .rounded-lg {
                border-radius: 0.5rem;
              }
              .shadow-lg {
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
              }
              .overflow-hidden {
                overflow: hidden;
              }
              .bg-blue-700 {
                background-color: #1d4ed8 !important;
                color: white;
              }
              .p-6 {
                padding: 1.5rem;
              }
              .text-white {
                color: white !important;
              }
              .text-3xl {
                font-size: 1.875rem;
                line-height: 2.25rem;
              }
              .font-bold {
                font-weight: 700;
              }
              .text-center {
                text-align: center;
              }
              .flex {
                display: flex;
              }
              .flex-wrap {
                flex-wrap: wrap;
              }
              .justify-center {
                justify-content: center;
              }
              .items-center {
                align-items: center;
              }
              .text-sm {
                font-size: 0.875rem;
                line-height: 1.25rem;
              }
              .mt-2 {
                margin-top: 0.5rem;
              }
              .gap-x-2 > * {
                margin-right: 0.5rem;
              }
              .break-all {
                word-break: break-all;
              }
              .p-8 {
                padding: 2rem;
              }
              .mb-6 {
                margin-bottom: 1.5rem;
              }
              .text-xl {
                font-size: 1.25rem;
                line-height: 1.75rem;
              }
              .border-b-2 {
                border-bottom-width: 2px;
              }
              .border-blue-700 {
                border-color: #1d4ed8;
              }
              .pb-1 {
                padding-bottom: 0.25rem;
              }
              .mb-3 {
                margin-bottom: 0.75rem;
              }
              .text-gray-700 {
                color: #374151;
              }
              .whitespace-pre-wrap {
                white-space: pre-wrap;
              }
              .break-words {
                word-wrap: break-word;
              }
              .list-disc {
                list-style-type: disc;
              }
              .pl-5 {
                padding-left: 1.25rem;
              }
              .mb-4 {
                margin-bottom: 1rem;
              }
              .text-lg {
                font-size: 1.125rem;
                line-height: 1.75rem;
              }
              @media print {
                body {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                }
                .bg-blue-700 {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                  background-color: #1d4ed8 !important;
                  color: white !important;
                }
                .text-white {
                  color: white !important;
                }
                @page {
                  size: A4;
                  margin: 0.5cm;
                }
                .no-print {
                  display: none;
                }
                .shadow-lg {
                  box-shadow: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="resume-container">
              ${resumeContent}
            </div>
            <script>
              window.onload = () => {
                window.print();
                setTimeout(() => {
                  window.close();
                }, 500);
              };
            </script>
          </body>
          </html>
        `;
        
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        toast({
          title: "Success",
          description: "Print dialog opened in new window",
        })
      } catch (error) {
        console.error("Error printing resume:", error)
        toast({
          title: "Print Error",
          description: "Failed to open print dialog",
          variant: "destructive",
        })
      } finally {
        setPrintLoading(false)
      }
    }

    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center mb-4 no-print">
          <h2 className="text-2xl font-bold">Resume Preview</h2>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            size="sm"
            onClick={handlePrintResume}
            disabled={printLoading}
          >
            {printLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Printer className="h-4 w-4 mr-2" />
            )}
            Print Resume
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto pr-2">
          <div ref={ref} className="bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-blue-700 text-white p-6">
              <h1 className="text-3xl font-bold text-center">{editedResume.name}</h1>
              <div className="flex flex-wrap justify-center items-center text-sm mt-2 gap-x-2">
                {editedResume.email && <span className="break-all">{editedResume.email}</span>}
                {editedResume.phone_no && <span>• {editedResume.phone_no}</span>}
                {editedResume.linkedin_profile && <span className="break-all">• {editedResume.linkedin_profile}</span>}
                {editedResume.github_profile && <span className="break-all">• {editedResume.github_profile}</span>}
                {editedResume.website && <span className="break-all">• {editedResume.website}</span>}
                {editedResume.address && <span>• {editedResume.address}</span>}
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-8">
              {/* Summary Section */}
              <div className="mb-6">
                <h2 className="text-xl font-bold border-b-2 border-blue-700 pb-1 mb-3">Summary</h2>
                <p className="text-gray-700 whitespace-pre-wrap break-words">{editedResume.summary}</p>
              </div>
              
              {/* Key Highlights Section */}
              {editedResume.skills && editedResume.skills.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold border-b-2 border-blue-700 pb-1 mb-3">Skills</h2>
                  <ul className="list-disc pl-5 mt-2 text-gray-700">
                    {editedResume.skills.map((skill, i) => (
                      <li key={i} className="break-words">{skill}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Work Experience Section */}
              {editedResume.experiences && editedResume.experiences.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold border-b-2 border-blue-700 pb-1 mb-3">Work Experience</h2>
                  {editedResume.experiences.map((exp, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">{exp.role} - {exp.company_name}</h3>
                      </div>
                      <ul className="list-disc pl-5 mt-2 text-gray-700">
                        {exp.bulletin.map((bullet, i) => (
                          <li key={i} className="break-words">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Projects Section */}
              {editedResume.projects && editedResume.projects.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold border-b-2 border-blue-700 pb-1 mb-3">Projects</h2>
                  {editedResume.projects.map((project, index) => (
                    <div key={index} className="mb-4">
                      <h3 className="font-bold text-lg">{project.name}</h3>
                      <ul className="list-disc pl-5 mt-2 text-gray-700">
                        {project.roles.map((role, i) => (
                          <li key={i} className="break-words">{role}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Education Section */}
              {editedResume.education && editedResume.education.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold border-b-2 border-blue-700 pb-1 mb-3">Education</h2>
                  <ul className="list-disc pl-5 mt-2 text-gray-700">
                    {editedResume.education.map((edu, i) => (
                      <li key={i} className="break-words">{edu}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Certifications Section */}
              {editedResume.certifications && editedResume.certifications.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold border-b-2 border-blue-700 pb-1 mb-3">Certifications</h2>
                  <ul className="list-disc pl-5 mt-2 text-gray-700">
                    {editedResume.certifications.map((cert, i) => (
                      <li key={i} className="break-words">{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Awards Section */}
              {editedResume.awards && editedResume.awards.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold border-b-2 border-blue-700 pb-1 mb-3">Awards</h2>
                  <ul className="list-disc pl-5 mt-2 text-gray-700">
                    {editedResume.awards.map((award, i) => (
                      <li key={i} className="break-words">{award}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
) 

ResumePreview.displayName = "ResumePreview"