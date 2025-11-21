"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit2, Trash2, MapPin, DollarSign, Users, Briefcase } from "lucide-react"
import JobPostingForm from "@/components/forms/job-posting-form"

interface Job {
  id: string
  title: string
  department: string
  location: string
  salary: string
  applicants: number
  status: "active" | "closed" | "draft"
}

export default function JobPostingsScreen() {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "1",
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      salary: "$150K - $200K",
      applicants: 24,
      status: "active",
    },
    {
      id: "2",
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      salary: "$130K - $180K",
      applicants: 18,
      status: "active",
    },
    {
      id: "3",
      title: "UX Designer",
      department: "Design",
      location: "New York, NY",
      salary: "$120K - $160K",
      applicants: 12,
      status: "active",
    },
  ])

  const [open, setOpen] = useState(false)

  const deleteJob = (id: string) => {
    setJobs(jobs.filter((job) => job.id !== id))
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Job Postings</h2>
          <p className="text-muted-foreground mt-1">Manage and track open positions</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Job Posting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Job Posting</DialogTitle>
            </DialogHeader>
            <JobPostingForm
              onClose={() => setOpen(false)}
              onAdd={(job) => {
                setJobs([...jobs, { ...job, id: Math.random().toString() }])
                setOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
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
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
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
              <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 text-destructive hover:text-destructive bg-transparent"
                onClick={() => deleteJob(job.id)}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
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
    </div>
  )
}
