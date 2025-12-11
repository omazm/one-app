"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TrainingForm } from "@/components/forms/training-form"
import { TrainingList } from "@/components/training/training-list"
import type { Training } from "@/app/training/types"

interface TrainingPageContentProps {
  initialTrainings: Training[]
}

export function TrainingPageContent({ initialTrainings }: TrainingPageContentProps) {
  const router = useRouter()
  const [trainings, setTrainings] = useState(initialTrainings)

  const handleUpdate = () => {
    router.refresh()
  }

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-6">
      <div className="lg:sticky lg:top-8 lg:self-start">
        <TrainingForm onSuccess={handleUpdate} />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">All Trainings ({initialTrainings.length})</h2>
        <TrainingList trainings={initialTrainings} onUpdate={handleUpdate} />
      </div>
    </div>
  )
}
