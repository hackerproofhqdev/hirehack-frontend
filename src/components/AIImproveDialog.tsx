"use client"

import { useState } from 'react'
import { Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Client } from "@langchain/langgraph-sdk"
import { useToast } from "@/hooks/use-toast"

interface AIImproveDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentTarget: {
    type: 'summary' | 'bullet' | 'role';
    text: string;
    expIndex?: number;
    bulletIndex?: number;
    projIndex?: number;
    roleIndex?: number;
  } | null;
  setCurrentTarget: (target: any) => void;
  improvedVersions: {
    improve_version1: string | null;
    improve_version2: string | null;
    improve_version3: string | null;
  } | null;
  setImprovedVersions: (versions: any) => void;
  applyImprovement: (version: string) => void;
}

export function AIImproveDialog({
  open,
  setOpen,
  currentTarget,
  setCurrentTarget,
  improvedVersions,
  setImprovedVersions,
  applyImprovement
}: AIImproveDialogProps) {
  const [aiLoading, setAiLoading] = useState(false)
  const { toast } = useToast()

  const handleImproveText = async (text: string) => {
    setAiLoading(true)
    
    try {
      const client = new Client({apiUrl: process.env.NEXT_PUBLIC_LANGCHAIN_URI , apiKey: process.env.NEXT_PUBLIC_LANGCHAIN_API_KEY})
      const response = await client.runs.wait(
        null,
        "resume_improver",
        {
          input: {
            "input_text": text
          }
        }
      )
      
      // Access the improved versions
      const responseData = response as any
      setImprovedVersions({
        improve_version1: responseData.improve_version?.improve_version1 || null,
        improve_version2: responseData.improve_version?.improve_version2 || null,
        improve_version3: responseData.improve_version?.improve_version3 || null
      })
    } catch (error) {
      console.error("Error improving text with AI:", error)
      toast({
        title: "AI Error",
        description: "Failed to improve text with AI",
        variant: "destructive",
      })
      setOpen(false)
    } finally {
      setAiLoading(false)
    }
  }

  // Call the improve function when dialog opens with new target
  if (open && currentTarget && !improvedVersions && !aiLoading) {
    handleImproveText(currentTarget.text)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>AI Improved Versions</DialogTitle>
          <DialogDescription>
            Choose one of the improved versions below to apply to your resume.
          </DialogDescription>
        </DialogHeader>
        
        {aiLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
            <p className="text-center">Generating improved versions...</p>
          </div>
        ) : (
          <Tabs defaultValue="version1" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="version1">Professional</TabsTrigger>
              <TabsTrigger value="version2">Achievement-Focused</TabsTrigger>
              <TabsTrigger value="version3">ATS-Optimized</TabsTrigger>
            </TabsList>
            
            {improvedVersions && (
              <>
                <TabsContent value="version1" className="space-y-4">
                  <div className="bg-gray-100 text-gray-900 p-4 rounded-md min-h-[150px] whitespace-pre-wrap">
                    {improvedVersions.improve_version1 || "No improvement available"}
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => improvedVersions.improve_version1 && applyImprovement(improvedVersions.improve_version1)}
                      disabled={!improvedVersions.improve_version1}
                      className="bg-emerald-500 hover:bg-emerald-600"
                    >
                      <Check className="mr-2 h-4 w-4" /> Apply This Version
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="version2" className="space-y-4">
                  <div className="bg-gray-100 text-gray-900 p-4 rounded-md min-h-[150px] whitespace-pre-wrap">
                    {improvedVersions.improve_version2 || "No improvement available"}
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => improvedVersions.improve_version2 && applyImprovement(improvedVersions.improve_version2)}
                      disabled={!improvedVersions.improve_version2}
                      className="bg-emerald-500 hover:bg-emerald-600"
                    >
                      <Check className="mr-2 h-4 w-4" /> Apply This Version
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="version3" className="space-y-4">
                  <div className="bg-gray-100 text-gray-900 p-4 rounded-md min-h-[150px] whitespace-pre-wrap">
                    {improvedVersions.improve_version3 || "No improvement available"}
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => improvedVersions.improve_version3 && applyImprovement(improvedVersions.improve_version3)}
                      disabled={!improvedVersions.improve_version3}
                      className="bg-emerald-500 hover:bg-emerald-600"
                    >
                      <Check className="mr-2 h-4 w-4" /> Apply This Version
                    </Button>
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
} 