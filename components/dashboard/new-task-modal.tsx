"use client"

import { useState } from "react"
import { Bug, TestTube, FileSearch, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface NewTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const quickChips = [
  { icon: Bug, label: "Fix a bug" },
  { icon: TestTube, label: "Write tests" },
  { icon: FileSearch, label: "Review a PR" },
]

export function NewTaskModal({ open, onOpenChange }: NewTaskModalProps) {
  const [taskInput, setTaskInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (!taskInput.trim()) return
    setIsSubmitting(true)
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false)
      setTaskInput("")
      onOpenChange(false)
    }, 1500)
  }

  const handleChipClick = (label: string) => {
    setTaskInput(label)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0d0d14] border-[rgba(255,255,255,0.1)] text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">New task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <textarea
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Paste a GitHub issue URL or describe a task in plain English…"
            className="w-full h-32 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-sm text-white placeholder:text-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
            disabled={isSubmitting}
          />
          <p className="text-xs text-white/40">
            Example: <span className="text-white/60 font-mono">https://github.com/org/repo/issues/482</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {quickChips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleChipClick(chip.label)}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-violet-500/15 hover:text-violet-300 text-xs text-white/70 transition-all border border-transparent hover:border-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <chip.icon className="h-3 w-3" />
                {chip.label}
              </button>
            ))}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)} 
            disabled={isSubmitting}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!taskInput.trim() || isSubmitting}
            className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Starting...
              </>
            ) : (
              "Run agents →"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
