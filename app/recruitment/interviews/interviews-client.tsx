"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, User, MapPin, Plus } from "lucide-react"
import InterviewForm from "@/components/forms/interview-form"
import { createInterviewAction, updateInterviewAction, deleteInterview, updateInterviewStatus } from "./actions"
import { toast } from "sonner"
import { useTransition } from "react"

interface Interview {
  id: string
  candidateId: string
  position: string
  date: Date
  time: string
  interviewer: string
  location: string
  status: string
  notes: string | null
  candidate: {
    id: string
    name: string
    email: string
    phone: string | null
  }
}

interface FormInterview {
  id: string
  candidateId: string
  position: string
  date: string
  time: string
  interviewer: string
  location: string
  notes: string | null
  status: string
}

interface Candidate {
  id: string
  name: string
  email: string
  phone: string | null
}

interface InterviewsClientProps {
  interviews: Interview[]
  candidates: Candidate[]
}

export default function InterviewsClient({ interviews, candidates }: InterviewsClientProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [editingInterview, setEditingInterview] = useState<FormInterview | null>(null)
  const [isPending, startTransition] = useTransition()

  const getStatusColor = (status: string) => {
    const normalized = status.toLowerCase()
    switch (normalized) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return ""
    }
  }

  const handleEdit = (interview: Interview) => {
    const formattedInterview: FormInterview = {
      id: interview.id,
      candidateId: interview.candidateId,
      position: interview.position,
      date: new Date(interview.date).toISOString().split('T')[0],
      time: interview.time,
      interviewer: interview.interviewer,
      location: interview.location,
      notes: interview.notes,
      status: interview.status,
    }
    setEditingInterview(formattedInterview)
    setShowDialog(true)
  }

  const handleNew = () => {
    setEditingInterview(null)
    setShowDialog(true)
  }

  const handleClose = () => {
    setShowDialog(false)
    setEditingInterview(null)
  }

  const handleCancel = (id: string) => {
    if (!confirm("Are you sure you want to cancel this interview?")) {
      return
    }

    startTransition(async () => {
      const result = await updateInterviewStatus(id, "cancelled")

      if (result.success) {
        toast.success("Interview cancelled")
      } else {
        toast.error(result.error || "Failed to cancel interview")
      }
    })
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interview Schedule</h1>
          <p className="text-muted-foreground mt-2">Manage candidate interviews</p>
        </div>
        <Button onClick={handleNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Schedule Interview
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {interviews.map((interview) => (
          <Card key={interview.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{interview.candidate.name}</h3>
                <p className="text-sm text-muted-foreground">{interview.position}</p>
              </div>
              <Badge className={getStatusColor(interview.status)}>
                {interview.status.charAt(0).toUpperCase() + interview.status.slice(1).toLowerCase()}
              </Badge>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-foreground">{formatDate(interview.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-foreground">{interview.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-primary" />
                <span className="text-foreground">{interview.interviewer}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-foreground">{interview.location}</span>
              </div>
              {interview.notes && (
                <p className="text-xs text-muted-foreground italic mt-2">{interview.notes}</p>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-transparent"
                onClick={() => handleEdit(interview)}
                disabled={isPending}
              >
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-transparent"
                onClick={() => handleCancel(interview.id)}
                disabled={isPending || interview.status === "CANCELLED"}
              >
                Cancel
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {interviews.length === 0 && (
        <Card className="p-12 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No interviews scheduled</p>
        </Card>
      )}

      <Dialog open={showDialog} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingInterview ? "Edit Interview" : "Schedule Interview"}
            </DialogTitle>
          </DialogHeader>
          <InterviewForm
            onClose={handleClose}
            interview={editingInterview || undefined}
            candidates={candidates}
            action={editingInterview ? updateInterviewAction : createInterviewAction}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
