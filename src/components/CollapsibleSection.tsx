"use client"

import { ReactNode } from 'react'
import { ChevronDown, ChevronUp, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CollapsibleSectionProps {
  title: string
  isExpanded: boolean
  toggleExpanded: () => void
  addItem?: () => void
  children: ReactNode
}

export function CollapsibleSection({
  title,
  isExpanded,
  toggleExpanded,
  addItem,
  children
}: CollapsibleSectionProps) {
  return (
    <div>
      <div 
        className="flex justify-between items-center mb-2 cursor-pointer"
        onClick={toggleExpanded}
      >
        <label className="block text-sm font-medium">{title}</label>
        <div className="flex items-center">
          {addItem && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                addItem();
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
          {isExpanded ? 
            <ChevronUp className="h-5 w-5" /> : 
            <ChevronDown className="h-5 w-5" />
          }
        </div>
      </div>
      
      {isExpanded && children}
    </div>
  )
} 