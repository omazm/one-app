"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Eye, Archive } from "lucide-react"
import { updateApplicationStatus, deleteApplication } from "./actions"
import { toast } from "sonner"
import { useTransition } from "react"

interface Application {
  id: string
  candidateId: string
  jobId: string
  status: string
  appliedDate: Date
  notes: string | null
  candidate: {
    id: string
    name: string
    email: string
    phone: string | null
  }
  job: {
    id: string
    title: string
  }
}

interface ApplicationsListClientProps {
  applications: Application[]
}

export default function ApplicationsListClient({ applications }: ApplicationsListClientProps) {
  const [isPending, startTransition] = useTransition()

  const getStatusColor = (status: string) => {
    const normalized = status.toLowerCase()
    switch (normalized) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "reviewing":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "shortlisted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return ""
    }
  }

  const handleUpdateStatus = (id: string, newStatus: string) => {
    startTransition(async () => {
      const result = await updateApplicationStatus(id, newStatus)
      
      if (result.success) {
        toast.success(`Application status updated to ${newStatus}`)
      } else {
        toast.error(result.error || "Failed to update status")
      }
    })
  }

  const handleArchive = (id: string) => {
    if (!confirm("Are you sure you want to archive this application?")) {
      return
    }

    startTransition(async () => {
      const result = await deleteApplication(id)
      
      if (result.success) {
        toast.success("Application archived successfully")
      } else {
        toast.error(result.error || "Failed to archive application")
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Applications</h1>
        <p className="text-muted-foreground mt-2">Track and manage all candidate applications</p>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <Card key={app.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{app.candidate.name}</h3>
                  <Badge className={getStatusColor(app.status)}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1).toLowerCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{app.job.title}</p>
                <div className="flex flex-col sm:flex-row gap-3 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {app.candidate.email}
                  </div>
                  {app.candidate.phone && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {app.candidate.phone}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Applied: {formatDate(app.appliedDate)}</p>
                {app.notes && (
                  <p className="text-xs text-muted-foreground mt-1 italic">Notes: {app.notes}</p>
                )}
              </div>

              <div className="flex gap-2 md:flex-col lg:flex-row">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleUpdateStatus(app.id, "reviewing")} 
                  className="gap-2"
                  disabled={isPending || app.status === "REVIEWING"}
                >
                  <Eye className="w-4 h-4" />
                  Review
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleUpdateStatus(app.id, "shortlisted")}
                  disabled={isPending || app.status === "SHORTLISTED"}
                >
                  Shortlist
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleArchive(app.id)}
                  className="gap-2 text-muted-foreground"
                  disabled={isPending}
                >
                  <Archive className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {applications.length === 0 && (
        <Card className="p-12 text-center">
          <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No applications yet</p>
        </Card>
      )}
    </div>
  )
}
