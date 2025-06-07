"use client"
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Grid,
  List,
  Filter,
  SortAsc,
  Download,
  Palette,
  Loader2
} from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// Legacy format imports - removed as they're not available in current project structure
import { getUserResumes, deleteResume as deleteApiResume, updateResumeTemplate, updateResumeName, ApiResume } from '@/services/resumeApi'
import { getUserProfile } from '@/actions/getUserProfile'
import { ResumeViewer } from "@/components/ResumeViewer";
import { TemplateSelector, TemplateType } from "@/components/TemplateSelector";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ResumePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [resumes, setResumes] = useState<(ApiResume & { title?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedResumeForTemplate, setSelectedResumeForTemplate] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('classic');
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [downloadResume, setDownloadResume] = useState<any>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadResumes = async () => {
      try {
        // Load from database
        const userProfile = await getUserProfile();
        const dbResumes = await getUserResumes(userProfile.id);
        
        // Format database resumes
        const formattedDbResumes = dbResumes.map((resume: ApiResume) => ({
          ...resume,
          title: resume.name
        }));

        setResumes(formattedDbResumes);
      } catch (err) {
        console.error("Error loading resumes from database:", err);
        setError("Failed to load saved resumes.");
      } finally {
        setLoading(false);
      }
    };

    loadResumes();
  }, []);

  const handleBack = () => setSelectedResume(null);
  const handleDashboardReturn = () => router.push('/dashboard/resumeAnalysis');

  // Filter all resumes (both database and local)
  const filteredResumes = resumes.filter((resume: any) => 
    resume.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRename = async (resumeId: string) => {
    if (!newTitle.trim()) return;
    
    try {
      // Update database resume name
      await updateResumeName(parseInt(resumeId), newTitle);
      
      // Update state
      setResumes(resumes.map((resume: any) => 
        resume.id?.toString() === resumeId.toString() 
          ? { ...resume, name: newTitle, title: newTitle }
          : resume
      ));
      
      setIsRenaming(null);
      setNewTitle('');
      
      toast({
        title: "Success",
        description: "Resume renamed successfully",
      });
    } catch (err) {
      console.error("Error renaming resume:", err);
      toast({
        title: "Error",
        description: "Failed to rename resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (resumeId: string | number) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        // Delete from database
        await deleteApiResume(parseInt(resumeId.toString()));
        
        // Update state - remove the deleted resume
        setResumes(resumes.filter(resume => resume.id?.toString() !== resumeId.toString()));
        
        toast({
          title: "Success",
          description: "Resume deleted successfully",
        });
      } catch (err) {
        console.error("Error deleting resume:", err);
        toast({
          title: "Error", 
          description: "Failed to delete resume. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleLoadInEditor = (resume: any) => {
    // Store the resume data to be loaded in the editor
    sessionStorage.setItem('loadResumeData', JSON.stringify({
      resume: resume.resume,
      template: resume.template
    }));
    router.push('/dashboard/resumeAnalysis');
  };

  const handleChangeTemplate = (resume: any) => {
    setSelectedResumeForTemplate(resume);
    setSelectedTemplate(resume.template || 'classic');
    setShowTemplateDialog(true);
  };

    const updateTemplate = async () => {
    if (!selectedResumeForTemplate) return;
    
    try {
      // Update database template
      await updateResumeTemplate(selectedTemplate, selectedResumeForTemplate.id);
      
      // Update state
      setResumes(resumes.map((resume: any) => 
        resume.id === selectedResumeForTemplate.id 
          ? { ...resume, template: selectedTemplate }
          : resume
      ));
      
      setShowTemplateDialog(false);
      setSelectedResumeForTemplate(null);
      
      toast({
        title: "Success",
        description: "Template updated successfully",
      });
    } catch (err) {
      console.error("Error updating template:", err);
      toast({
        title: "Error",
        description: "Failed to update template. Please try again.",
        variant: "destructive"
      });
    }
  };

  const startRenaming = (resume: any) => {
    setIsRenaming(resume.id?.toString() || '');
    setNewTitle(resume.title || '');
  };

  const handleDownloadResume = async (resume: any) => {
    setIsDownloading(resume.id?.toString() || '');
    setDownloadResume(resume);
    
    // Wait for the component to render
    setTimeout(async () => {
      try {
        if (!downloadRef.current) {
          throw new Error("Download reference not found");
        }

        // Create canvas from the rendered resume
        const canvas = await html2canvas(downloadRef.current, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: downloadRef.current.scrollWidth,
          height: downloadRef.current.scrollHeight
        } as any);

        // Calculate dimensions for A4 page
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        
        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add additional pages if needed
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Generate filename
        const fileName = resume.resume?.name || resume.title
          ? `${(resume.resume?.name || resume.title).replace(/[^a-zA-Z0-9]/g, '_')}_Resume.pdf`
          : `Resume_${resume.template || 'classic'}_${new Date().getTime()}.pdf`;

        // Download the PDF
        pdf.save(fileName);

        toast({
          title: "Success",
          description: "Resume downloaded successfully",
        });
      } catch (error) {
        console.error("Error downloading resume:", error);
        toast({
          title: "Error",
          description: "Failed to download resume. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsDownloading(null);
        setDownloadResume(null);
      }
    }, 500);
  };

  const renderResumeActions = (resume: any) => (
    <div className="flex gap-2">
      <button 
        onClick={() => setSelectedResume(resume)} 
        className="p-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition"
        title="View"
      >
        <Eye size={20} />
      </button>
      <button 
        onClick={() => handleDownloadResume(resume)} 
        disabled={isDownloading === resume.id?.toString()}
        className="p-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-600 disabled:opacity-50 rounded-lg transition"
        title="Download PDF"
      >
        {isDownloading === resume.id?.toString() ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <Download size={20} />
        )}
      </button>
      <button 
        onClick={() => handleLoadInEditor(resume)} 
        className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition"
        title="Load in Editor"
      >
        <Edit size={20} />
      </button>
      <button 
        onClick={() => handleChangeTemplate(resume)} 
        className="p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition"
        title="Change Template"
      >
        <Palette size={20} />
      </button>
      <button 
        onClick={() => startRenaming(resume)} 
        className="p-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition"
        title="Rename"
      >
        <Edit size={20} />
      </button>
      <button 
        onClick={() => handleDelete(resume.id)} 
        className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
        title="Delete"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );

  const renderResumeTitle = (resume: any) => {
    if (isRenaming === resume.id?.toString()) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleRename(resume.id?.toString() || '')}
            onBlur={() => handleRename(resume.id?.toString() || '')}
            className="px-2 py-1 bg-[#2A3447] border border-gray-600 rounded text-white w-full"
            autoFocus
          />
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-emerald-400">
          {resume.title || "Untitled Resume"}
        </h2>

        {resume.template && (
          <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded capitalize">
            {resume.template}
          </span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1729] text-gray-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F1729] text-gray-300">
        <p className="text-xl text-red-400 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (selectedResume) {
    const wrapperClass = "p-4 bg-[#0F1729] min-h-screen text-gray-300";

    // Handle local resumes with template-based rendering
    return (
      <div className={wrapperClass}>
        <button
          onClick={handleBack}
          className="mb-4 flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Resumes
        </button>
        <ResumeViewer 
          resume={selectedResume.resume}
          selectedTemplate={selectedResume.template || 'classic'}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1729] text-gray-300 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center">
            <button 
              onClick={handleDashboardReturn}
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mr-8"
            >
              <ArrowLeft size={24} />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
            <h1 className="text-2xl sm:text-4xl font-bold text-emerald-400">My Resumes</h1>
          </div>
          <button 
            onClick={() => router.push('/dashboard/resumeAnalysis/create')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-all transform hover:scale-105"
          >
            <Plus size={20} />
            Create New Resume
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search resumes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1A2332] border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'bg-[#1A2332] text-gray-400 hover:bg-gray-700'}`}
            >
              <Grid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'bg-[#1A2332] text-gray-400 hover:bg-gray-700'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Resumes Grid/List */}
        {filteredResumes.length === 0 ? (
          <div className="text-center py-12 bg-[#1A2332] rounded-lg border border-gray-700">
            <p className="text-xl mb-4">No resumes found</p>
            <button 
              onClick={() => router.push('/dashboard/resumeAnalysis/create')}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition"
            >
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
            {filteredResumes.map((resume) => (
              <div
                key={resume.id}
                className={`${
                  viewMode === 'grid' 
                    ? 'bg-[#1A2332] border border-gray-700 rounded-lg p-6 transition-all transform hover:-translate-y-1 hover:shadow-xl' 
                    : 'bg-[#1A2332] border border-gray-700 rounded-lg p-4 flex items-center gap-4'
                }`}
                onMouseEnter={() => setIsHovered(resume.id?.toString() || '')}
                onMouseLeave={() => setIsHovered(null)}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="relative w-full h-48 mb-4 group">
                      <Image
                        src="/1.webp"
                        alt="Resume Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                      {isHovered === resume.id?.toString() && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center gap-4">
                          {renderResumeActions(resume)}
                        </div>
                      )}
                    </div>
                    {renderResumeTitle(resume)}
                    <div className="flex items-center gap-2 text-gray-400 mt-2">
                      <Calendar size={16} />
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src="/1.webp"
                        alt="Resume Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-grow">
                      {renderResumeTitle(resume)}
                      <div className="flex items-center gap-2 text-gray-400 mt-1">
                        <Calendar size={16} />
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                    {renderResumeActions(resume)}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Hidden download container */}
        {downloadResume && (
          <div 
            ref={downloadRef}
            className="fixed -top-[9999px] -left-[9999px] w-[210mm] bg-white p-8 font-sans"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            <ResumeViewer 
              resume={downloadResume.resume}
              selectedTemplate={downloadResume.template || 'classic'}
            />
          </div>
        )}

        {/* Template Change Dialog */}
        <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
          <DialogContent className="max-w-4xl bg-[#1A2332] border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-emerald-400">Change Template</DialogTitle>
              <DialogDescription className="text-gray-300">
                Select a new template for "{selectedResumeForTemplate?.title}"
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
              />
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowTemplateDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={updateTemplate}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                Update Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}