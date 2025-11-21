"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Users } from "lucide-react"

interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "in-progress" | "on-hold" | "completed"
  assignedTeam?: string
  assignedEmployees: string[]
  startDate: string
  dueDate: string
}

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Mobile App Redesign",
    description: "Complete redesign of the mobile application UI/UX",
    status: "in-progress",
    assignedTeam: "Engineering",
    assignedEmployees: ["Sarah Johnson", "Alex Chen"],
    startDate: "2024-01-15",
    dueDate: "2024-03-30",
  },
  {
    id: "2",
    name: "Q1 Marketing Campaign",
    description: "Quarterly marketing initiative and brand awareness",
    status: "in-progress",
    assignedTeam: "Marketing",
    assignedEmployees: ["Lisa Anderson"],
    startDate: "2024-01-01",
    dueDate: "2024-03-31",
  },
  {
    id: "3",
    name: "Database Migration",
    description: "Migrate from PostgreSQL to new cloud infrastructure",
    status: "planning",
    assignedTeam: "Engineering",
    assignedEmployees: [],
    startDate: "2024-02-01",
    dueDate: "2024-04-15",
  },
]

const statusColors = {
  planning: "bg-blue-100 text-blue-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  "on-hold": "bg-gray-100 text-gray-800",
  completed: "bg-green-100 text-green-800",
}

const employees = [
  "Sarah Johnson",
  "Alex Chen",
  "Maria Garcia",
  "James Wilson",
  "Emily Davis",
  "Lisa Anderson",
  "David Brown",
  "Sophie Turner",
]

const teams = ["Engineering", "Product Design", "Marketing", "Sales", "HR"]

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planning" as const,
    assignedTeam: "",
    assignedEmployees: [] as string[],
    startDate: "",
    dueDate: "",
  })

  const handleAddProject = () => {
    if (formData.name && formData.startDate && formData.dueDate) {
      const newProject: Project = {
        id: String(projects.length + 1),
        ...formData,
      }
      setProjects([...projects, newProject])
      setFormData({
        name: "",
        description: "",
        status: "planning",
        assignedTeam: "",
        assignedEmployees: [],
        startDate: "",
        dueDate: "",
      })
      setShowForm(false)
    }
  }

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id))
  }

  const toggleEmployee = (employee: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedEmployees: prev.assignedEmployees.includes(employee)
        ? prev.assignedEmployees.filter((e) => e !== employee)
        : [...prev.assignedEmployees, employee],
    }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-2">Create and manage projects with team assignments</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Project Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Mobile App Redesign"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description..."
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as Project["status"],
                    })
                  }
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Assign Team</label>
                <select
                  value={formData.assignedTeam}
                  onChange={(e) => setFormData({ ...formData, assignedTeam: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Team</option>
                  {teams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Assign Employees</label>
              <div className="grid grid-cols-2 gap-3">
                {employees.map((employee) => (
                  <label
                    key={employee}
                    className="flex items-center gap-2 p-2 border border-border rounded-md cursor-pointer hover:bg-accent"
                  >
                    <input
                      type="checkbox"
                      checked={formData.assignedEmployees.includes(employee)}
                      onChange={() => toggleEmployee(employee)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-foreground">{employee}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddProject} className="flex-1">
                Create Project
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle>{project.name}</CardTitle>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        statusColors[project.status]
                      }`}
                    >
                      {project.status.replace("-", " ")}
                    </span>
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteProject(project.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Timeline</p>
                  <p className="text-sm text-foreground">
                    {new Date(project.startDate).toLocaleDateString()} -{" "}
                    {new Date(project.dueDate).toLocaleDateString()}
                  </p>
                </div>

                {project.assignedTeam && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Assigned Team</p>
                    <div className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium">
                      {project.assignedTeam}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Assigned Employees</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      {project.assignedEmployees.length > 0
                        ? `${project.assignedEmployees.length} assigned`
                        : "None assigned"}
                    </span>
                  </div>
                  {project.assignedEmployees.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {project.assignedEmployees.map((emp, idx) => (
                        <p key={idx} className="text-xs text-muted-foreground">
                          • {emp}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
