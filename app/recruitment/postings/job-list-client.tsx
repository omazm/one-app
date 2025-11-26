"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit2, MapPin, DollarSign, Users, Briefcase, Plus } from "lucide-react"
import JobPostingForm from "@/components/forms/job-posting-form"
import DeleteJobButton from "./delete-job-button"

interface JobPosting {
  id: string
  title: string
  department: string
  location: string
  salary: string
  description: string | null
  applicants: number
  status: string
  createdAt: Date
  updatedAt: Date
}

interface JobListClientProps {
  jobs: JobPosting[]
}

export default function JobListClient({ jobs }: JobListClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null)

  const getStatusVariant = (status: string) => {
    const normalized = status.toLowerCase()
    switch (normalized) {
      case "active":
        return "default"
      case "closed":
        return "secondary"
      case "draft":
        return "outline"
      default:
        return "default"
    }
  }

  const handleEdit = (job: JobPosting) => {
    setEditingJob(job)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingJob(null)
  }

  const handleNewJob = () => {
    setEditingJob(null)
    setDialogOpen(true)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Job Postings</h2>
          <p className="text-muted-foreground mt-1">Manage and track open positions</p>
        </div>
        <Button className="gap-2" onClick={handleNewJob}>
          <Plus className="w-4 h-4" />
          New Job Posting
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {jobs.map((job) => (
          <Card key={job.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.department}</p>
              </div>
              <Badge variant={getStatusVariant(job.status) as any}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1).toLowerCase()}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {job.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                {job.salary}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                {job.applicants} applicants
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 bg-transparent"
                onClick={() => handleEdit(job)}
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <DeleteJobButton jobId={job.id} />
            </div>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <Card className="p-12 text-center">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No job postings yet. Create your first one!</p>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingJob ? "Edit Job Posting" : "Create New Job Posting"}</DialogTitle>
          </DialogHeader>
          <JobPostingForm 
            onClose={handleDialogClose} 
            job={editingJob || undefined}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
