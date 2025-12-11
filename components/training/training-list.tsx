"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Training, TrainingStatus } from "@/app/training/types"
import { updateTrainingStatus, deleteTraining } from "@/app/training/actions/training-actions"
import { MoreVertical, CheckCircle, Clock, PauseCircle, XCircle, Trash2, User, Calendar } from "lucide-react"
import { format } from "date-fns"
import { TrainingPosterModal } from "./training-poster-modal"

interface TrainingListProps {
  trainings: Training[]
  onUpdate?: () => void
}

const statusConfig: Record<TrainingStatus, { label: string; icon: React.ReactNode; className: string }> = {
  PENDING: {
    label: "Pending",
    icon: <Clock className="h-3.5 w-3.5" />,
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  COMPLETED: {
    label: "Completed",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  POSTPONED: {
    label: "Postponed",
    icon: <PauseCircle className="h-3.5 w-3.5" />,
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: <XCircle className="h-3.5 w-3.5" />,
    className: "bg-red-500/10 text-red-600 border-red-500/20",
  },
}

export function TrainingList({ trainings, onUpdate }: TrainingListProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleStatusChange = async (id: string, status: TrainingStatus) => {
    setUpdatingId(id)
    try {
      await updateTrainingStatus(id, status)
      onUpdate?.()
    } catch (error) {
      console.error("Failed to update status:", error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    setUpdatingId(id)
    try {
      await deleteTraining(id)
      onUpdate?.()
    } catch (error) {
      console.error("Failed to delete training:", error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleCardClick = (training: Training) => {
    setSelectedTraining(training)
    setModalOpen(true)
  }

  if (trainings.length === 0) {
    return (
      <Card className="border-border/50 bg-card">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">No trainings yet</h3>
          <p className="text-sm text-muted-foreground">Create your first training to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {trainings.map((training) => {
          const status = statusConfig[training.status]
          const isUpdating = updatingId === training.id

          return (
            <Card
              key={training.id}
              className={`border-border/50 bg-card transition-all cursor-pointer hover:border-primary/30 hover:shadow-md ${isUpdating ? "opacity-50" : ""}`}
              onClick={() => handleCardClick(training)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {training.trainerPhotoUrl ? (
                    <img
                      src={training.trainerPhotoUrl || "/placeholder.svg"}
                      alt={training.trainerName}
                      className="w-14 h-14 rounded-lg object-cover border border-border flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground truncate">{training.title}</h3>
                        <p className="text-sm text-muted-foreground">{training.trainerName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(training.date), "MMM d, yyyy")}
                        </p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStatusChange(training.id, "PENDING")
                            }}
                          >
                            <Clock className="h-4 w-4 mr-2" /> Mark as Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStatusChange(training.id, "COMPLETED")
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" /> Mark as Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStatusChange(training.id, "POSTPONED")
                            }}
                          >
                            <PauseCircle className="h-4 w-4 mr-2" /> Mark as Postponed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStatusChange(training.id, "CANCELLED")
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-2" /> Mark as Cancelled
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(training.id)
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.className}`}
                      >
                        {status.icon}
                        {status.label}
                      </span>

                      {training.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <TrainingPosterModal training={selectedTraining} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}
