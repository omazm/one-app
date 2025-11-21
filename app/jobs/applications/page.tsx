"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Eye, Archive } from "lucide-react"

interface Application {
  id: string
  candidateName: string
  email: string
  phone: string
  position: string
  appliedDate: string
  status: "new" | "reviewing" | "shortlisted" | "rejected"
}

export default function ApplicationsScreen() {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: "1",
      candidateName: "Sarah Chen",
      email: "sarah.chen@email.com",
      phone: "(555) 123-4567",
      position: "Senior Frontend Developer",
      appliedDate: "2024-01-15",
      status: "new",
    },
    {
      id: "2",
      candidateName: "Mike Johnson",
      email: "mike.j@email.com",
      phone: "(555) 234-5678",
      position: "Senior Frontend Developer",
      appliedDate: "2024-01-14",
      status: "reviewing",
    },
    {
      id: "3",
      candidateName: "Emma Wilson",
      email: "emma.w@email.com",
      phone: "(555) 345-6789",
      position: "Product Manager",
      appliedDate: "2024-01-13",
      status: "shortlisted",
    },
    {
      id: "4",
      candidateName: "Alex Rodriguez",
      email: "alex.r@email.com",
      phone: "(555) 456-7890",
      position: "UX Designer",
      appliedDate: "2024-01-12",
      status: "rejected",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const updateStatus = (id: string, newStatus: Application["status"]) => {
    setApplications(applications.map((app) => (app.id === id ? { ...app, status: newStatus } : app)))
  }

  const archiveApplication = (id: string) => {
    setApplications(applications.filter((app) => app.id !== id))
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
                  <h3 className="text-lg font-semibold text-foreground">{app.candidateName}</h3>
                  <Badge className={getStatusColor(app.status)}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{app.position}</p>
                <div className="flex flex-col sm:flex-row gap-3 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {app.email}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {app.phone}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Applied: {app.appliedDate}</p>
              </div>

              <div className="flex gap-2 md:flex-col lg:flex-row">
                <Button variant="outline" size="sm" onClick={() => updateStatus(app.id, "reviewing")} className="gap-2">
                  <Eye className="w-4 h-4" />
                  Review
                </Button>
                <Button variant="outline" size="sm" onClick={() => updateStatus(app.id, "shortlisted")}>
                  Shortlist
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => archiveApplication(app.id)}
                  className="gap-2 text-muted-foreground"
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
