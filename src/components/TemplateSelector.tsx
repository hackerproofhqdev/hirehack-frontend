import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export type TemplateType = 'classic' | 'modern' | 'creative' | 'professional'

interface TemplateSelectorProps {
  selectedTemplate: TemplateType
  onTemplateChange: (template: TemplateType) => void
}

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  const templates = [
    {
      id: 'classic' as TemplateType,
      name: 'Classic',
      description: 'Traditional resume format with clean lines',
      preview: '/template-previews/classic.png',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      accentColor: 'text-blue-600'
    },
    {
      id: 'modern' as TemplateType,
      name: 'Modern',
      description: 'Two-column layout with sidebar design',
      preview: '/template-previews/modern.png',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      accentColor: 'text-emerald-600'
    },
    {
      id: 'creative' as TemplateType,
      name: 'Creative',
      description: 'Colorful and unique design with gradients',
      preview: '/template-previews/creative.png',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      accentColor: 'text-purple-600'
    },
    {
      id: 'professional' as TemplateType,
      name: 'Professional',
      description: 'Corporate-style with formal appearance',
      preview: '/template-previews/professional.png',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      accentColor: 'text-gray-600'
    }
  ]

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Choose Resume Template</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`relative cursor-pointer transition-all duration-300 ${
              selectedTemplate === template.id
                ? `${template.bgColor} ${template.borderColor} border-2 scale-105 shadow-lg`
                : 'bg-gray-100 border border-gray-300 hover:scale-102 hover:shadow-md'
            } rounded-lg p-4`}
            onClick={() => onTemplateChange(template.id)}
          >
            {/* Template Preview */}
            <div className="aspect-[3/4] bg-white rounded border mb-3 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col p-2">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-2 bg-gray-400 rounded mb-1"></div>
                <div className="h-2 bg-gray-400 rounded mb-2"></div>
                <div className="h-3 bg-gray-500 rounded mb-2"></div>
                <div className="flex gap-1 mb-2">
                  <div className="h-1 bg-gray-400 rounded flex-1"></div>
                  <div className="h-1 bg-gray-400 rounded flex-1"></div>
                </div>
                <div className="h-2 bg-gray-400 rounded mb-1"></div>
                <div className="h-2 bg-gray-400 rounded"></div>
              </div>
            </div>

            {/* Template Info */}
            <h4 className={`font-semibold mb-1 ${
              selectedTemplate === template.id ? template.accentColor : 'text-gray-700'
            }`}>
              {template.name}
            </h4>
            <p className="text-xs text-gray-500 leading-tight">
              {template.description}
            </p>

            {/* Selected Indicator */}
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2">
                <CheckCircle className={`w-5 h-5 ${template.accentColor}`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 