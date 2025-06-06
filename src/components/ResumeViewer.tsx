import { ParsedResume } from '@/types'
import { TemplateType } from './TemplateSelector'
import { ClassicTemplate } from './ResumeTemplates/ClassicTemplate'
import { ModernTemplate } from './ResumeTemplates/ModernTemplate'
import { CreativeTemplate } from './ResumeTemplates/CreativeTemplate'
import { ProfessionalTemplate } from './ResumeTemplates/ProfessionalTemplate'

interface ResumeViewerProps {
  resume: ParsedResume
  selectedTemplate: TemplateType
}

export function ResumeViewer({ resume, selectedTemplate }: ResumeViewerProps) {
  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'classic':
        return <ClassicTemplate resume={resume} />
      case 'modern':
        return <ModernTemplate resume={resume} />
      case 'creative':
        return <CreativeTemplate resume={resume} />
      case 'professional':
        return <ProfessionalTemplate resume={resume} />
      default:
        return <ClassicTemplate resume={resume} />
    }
  }

  return (
    <div className="w-full h-full overflow-auto">
      {renderTemplate()}
    </div>
  )
} 