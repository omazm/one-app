"use client"

import type React from "react"

import type { Training, TrainingStatus } from "@/app/training/types"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { format } from "date-fns"
import { Calendar, User, Clock, CheckCircle, PauseCircle, XCircle } from "lucide-react"

interface TrainingPosterModalProps {
  training: Training | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusConfig: Record<TrainingStatus, { label: string; icon: React.ReactNode; color: string }> = {
  PENDING: {
    label: "Upcoming",
    icon: <Clock className="h-5 w-5" />,
    color: "from-amber-500 to-orange-500",
  },
  COMPLETED: {
    label: "Completed",
    icon: <CheckCircle className="h-5 w-5" />,
    color: "from-emerald-500 to-teal-500",
  },
  POSTPONED: {
    label: "Postponed",
    icon: <PauseCircle className="h-5 w-5" />,
    color: "from-blue-500 to-indigo-500",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: <XCircle className="h-5 w-5" />,
    color: "from-red-500 to-rose-500",
  },
}

export function TrainingPosterModal({ training, open, onOpenChange }: TrainingPosterModalProps) {
  if (!training) return null

  const status = statusConfig[training.status]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 bg-transparent">
        <div className="relative bg-card rounded-2xl overflow-hidden shadow-2xl">
          {/* Decorative gradient header */}
          <div className={`h-32 bg-gradient-to-br ${status.color} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-20 bg-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />

            {/* Status badge */}
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm text-sm font-semibold shadow-lg">
                {status.icon}
                {status.label}
              </span>
            </div>
          </div>

          {/* Main content */}
          <div className="relative px-8 pb-8 -mt-16">
            {/* Trainer photo */}
            <div className="flex items-end gap-6 mb-6">
              {training.trainerPhotoUrl ? (
                <img
                  src={training.trainerPhotoUrl || "/placeholder.svg"}
                  alt={training.trainerName}
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-card shadow-xl"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-muted border-4 border-card shadow-xl flex items-center justify-center">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
              )}

              <div className="pb-2">
                <h2 className="text-2xl font-bold text-foreground leading-tight text-balance">{training.title}</h2>
                <p className="text-lg text-muted-foreground mt-1">{training.trainerName}</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-muted/50">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${status.color} text-white`}>
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Training Date</p>
                <p className="text-lg font-semibold text-foreground">
                  {format(new Date(training.date), "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                About This Training
              </h3>
              <div
                className="prose prose-sm max-w-none text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_p]:mb-2"
                dangerouslySetInnerHTML={{ __html: training.description || "<p>No description provided.</p>" }}
              />
            </div>

            {/* Tags */}
            {training.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {training.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-br ${status.color} text-white shadow-md`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Decorative footer */}
            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
              <span>Training ID: {training.id.slice(0, 8)}</span>
              <span>Created {format(new Date(training.createdAt), "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
