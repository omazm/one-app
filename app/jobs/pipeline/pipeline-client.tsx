"use client"

import { useState, useTransition } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, X } from "lucide-react"
import { updatePipelineStage, deletePipeline } from "./actions"
import { toast } from "sonner"

interface Pipeline {
  id: string
  candidateId: string
  position: string
  stage: string
  createdAt: Date
  updatedAt: Date
  candidate: {
    id: string
    name: string
    email: string
    phone: string | null
  }
}

interface PipelineClientProps {
  pipelines: Pipeline[]
}

export default function PipelineClient({ pipelines }: PipelineClientProps) {
  const [isPending, startTransition] = useTransition()

  const stages = ["applied", "screening", "interview", "offer", "hired"]

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      applied: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
      screening: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
      interview: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800",
      offer: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
      hired: "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800",
    }
    return colors[stage.toLowerCase()] || ""
  }

  const getBadgeColor = (stage: string) => {
    const colors: Record<string, string> = {
      applied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      screening: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      interview: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      offer: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      hired: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    }
    return colors[stage.toLowerCase()] || ""
  }

  const moveToNextStage = (pipeline: Pipeline) => {
    const currentStageIndex = stages.indexOf(pipeline.stage.toLowerCase())
    if (currentStageIndex < stages.length - 1) {
      const nextStage = stages[currentStageIndex + 1]
      handleStageUpdate(pipeline.id, nextStage)
    }
  }

  const moveToPreviousStage = (pipeline: Pipeline) => {
    const currentStageIndex = stages.indexOf(pipeline.stage.toLowerCase())
    if (currentStageIndex > 0) {
      const previousStage = stages[currentStageIndex - 1]
      handleStageUpdate(pipeline.id, previousStage)
    }
  }

  const handleStageUpdate = (id: string, newStage: string) => {
    startTransition(async () => {
      const result = await updatePipelineStage(id, newStage)

      if (result.success) {
        toast.success(`Moved to ${newStage} stage`)
      } else {
        toast.error(result.error || "Failed to update stage")
      }
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to remove this candidate from the pipeline?")) {
      return
    }

    startTransition(async () => {
      const result = await deletePipeline(id)

      if (result.success) {
        toast.success("Candidate removed from pipeline")
      } else {
        toast.error(result.error || "Failed to remove candidate")
      }
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Candidate Pipeline</h1>
        <p className="text-muted-foreground mt-2">View candidates at each stage of the hiring process</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stages.map((stage) => {
          const stagePipelines = pipelines.filter((p) => p.stage.toLowerCase() === stage)
          return (
            <div key={stage} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground capitalize">{stage}</h3>
                <span className="text-sm font-medium text-muted-foreground">{stagePipelines.length}</span>
              </div>
              <div className="space-y-3">
                {stagePipelines.map((pipeline) => (
                  <Card
                    key={pipeline.id}
                    className={`p-4 hover:shadow-md transition-shadow border-2 ${getStageColor(stage)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{pipeline.candidate.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{pipeline.position}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 -mt-1 -mr-1"
                        onClick={() => handleDelete(pipeline.id)}
                        disabled={isPending}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <Badge className={`mt-2 text-xs ${getBadgeColor(stage)}`}>
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </Badge>
                    <div className="flex gap-1 mt-3">
                      {stages.indexOf(stage) > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-7 text-xs"
                          onClick={() => moveToPreviousStage(pipeline)}
                          disabled={isPending}
                        >
                          <ChevronLeft className="h-3 w-3" />
                        </Button>
                      )}
                      {stages.indexOf(stage) < stages.length - 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-7 text-xs"
                          onClick={() => moveToNextStage(pipeline)}
                          disabled={isPending}
                        >
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {pipelines.length === 0 && (
        <Card className="p-12 text-center mt-8">
          <p className="text-muted-foreground">No candidates in pipeline yet</p>
        </Card>
      )}
    </div>
  )
}
