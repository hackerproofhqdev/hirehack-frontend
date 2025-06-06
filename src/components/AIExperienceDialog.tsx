import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface AIExperienceDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onGenerate: (jobDescription: string, companies: string[]) => Promise<void>;
  loading: boolean;
}

export function AIExperienceDialog({ open, setOpen, onGenerate, loading }: AIExperienceDialogProps) {
  const [jobDescription, setJobDescription] = useState("")
  const [company, setCompany] = useState("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[625px] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Generate Work Experience with AI</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Job Description</label>
            <Textarea
              className="bg-gray-700 border-gray-600"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={5}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Target Company</label>
            <Input
              className="mb-2 bg-gray-700 border-gray-600"
              placeholder="Add Company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={() => onGenerate(jobDescription, company.trim() ? [company.trim()] : [])}
            disabled={loading || !jobDescription || !company.trim()}
          >
            {loading ? "Generating..." : "Generate Experience"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
