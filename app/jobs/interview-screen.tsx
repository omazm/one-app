"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, MapPin, Plus } from "lucide-react"
import InterviewForm from "@/components/forms/interview-form"

interface Interview {
  id: string
  candidateName: string
  position: string
  date: string
  time: string
  interviewer: string
  location: string
  status: "scheduled" | "completed" | "cancelled"
}

export default function InterviewScreen() {
  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: "1",
      candidateName: "Emma Wilson",
      position: "Product Manager",
      date: "2024-01-22",
      time: "10:00 AM",
      interviewer: "John Smith",
      location: "Conference Room A",
      status: "scheduled",
    },
    {
      id: "2",
      candidateName: "James Brown",
      position: "UX Designer",
      date: "2024-01-22",
      time: "2:00 PM",
      interviewer: "Sarah Davis",
      location: "Zoom",
      status: "scheduled",
    },
    {
      id: "3",
      candidateName: "Mike Johnson",
      position: "Senior Frontend Developer",
      date: "2024-01-20",
      time: "11:00 AM",
      interviewer: "Alex Turner",
      location: "Conference Room B",
      status: "completed",
    },
  ])

  const [showForm, setShowForm] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interview Schedule</h1>
          <p className="text-muted-foreground mt-2">Manage candidate interviews</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Schedule Interview
        </Button>
      </div>

      {showForm && (
        <InterviewForm
          onClose={() => setShowForm(false)}
          onAdd={(interview) => {
            setInterviews([...interviews, { ...interview, id: Math.random().toString() }])
            setShowForm(false)
          }}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {interviews.map((interview) => (
          <Card key={interview.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{interview.candidateName}</h3>
                <p className="text-sm text-muted-foreground">{interview.position}</p>
              </div>
              <Badge className={getStatusColor(interview.status)}>
                {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
              </Badge>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-foreground">{interview.date}</span>
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
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Edit
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
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
    </div>
  )
}
