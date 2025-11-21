"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Candidate {
  id: string
  name: string
  position: string
  stage: "applied" | "screening" | "interview" | "offer" | "hired"
}

export default function PipelineScreen() {
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: "1", name: "Sarah Chen", position: "Senior Frontend Developer", stage: "applied" },
    { id: "2", name: "Mike Johnson", position: "Senior Frontend Developer", stage: "screening" },
    { id: "3", name: "Emma Wilson", position: "Product Manager", stage: "interview" },
    { id: "4", name: "James Brown", position: "UX Designer", stage: "interview" },
    { id: "5", name: "Lisa Anderson", position: "Senior Frontend Developer", stage: "offer" },
  ])

  const stages = ["applied", "screening", "interview", "offer", "hired"]

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      applied: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
      screening: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
      interview: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800",
      offer: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
      hired: "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800",
    }
    return colors[stage] || ""
  }

  const getBadgeColor = (stage: string) => {
    const colors: Record<string, string> = {
      applied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      screening: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      interview: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      offer: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      hired: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    }
    return colors[stage] || ""
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Candidate Pipeline</h1>
        <p className="text-muted-foreground mt-2">View candidates at each stage of the hiring process</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stages.map((stage) => {
          const stageCandidates = candidates.filter((c) => c.stage === stage)
          return (
            <div key={stage} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground capitalize">{stage}</h3>
                <span className="text-sm font-medium text-muted-foreground">{stageCandidates.length}</span>
              </div>
              <div className="space-y-3">
                {stageCandidates.map((candidate) => (
                  <Card
                    key={candidate.id}
                    className={`p-4 cursor-move hover:shadow-md transition-shadow border-2 ${getStageColor(stage)}`}
                  >
                    <p className="font-medium text-foreground text-sm">{candidate.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{candidate.position}</p>
                    <Badge className={`mt-2 ${getBadgeColor(stage)}`}>
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </Badge>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
