"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface Team {
  id: string
  name: string
  lead: string
  department: string
  memberCount: number
  members: string[]
}

const initialTeams: Team[] = [
  {
    id: "1",
    name: "Engineering",
    lead: "Sarah Johnson",
    department: "Tech",
    memberCount: 8,
    members: ["Sarah Johnson", "Alex Chen", "Maria Garcia"],
  },
  {
    id: "2",
    name: "Product Design",
    lead: "James Wilson",
    department: "Design",
    memberCount: 5,
    members: ["James Wilson", "Emily Davis"],
  },
  {
    id: "3",
    name: "Marketing",
    lead: "Lisa Anderson",
    department: "Marketing",
    memberCount: 6,
    members: ["Lisa Anderson", "David Brown", "Sophie Turner"],
  },
]

export default function TeamsScreen() {
  const [teams, setTeams] = useState<Team[]>(initialTeams)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    lead: "",
    department: "",
  })

  const handleAddTeam = () => {
    if (formData.name && formData.lead && formData.department) {
      const newTeam: Team = {
        id: String(teams.length + 1),
        name: formData.name,
        lead: formData.lead,
        department: formData.department,
        memberCount: 1,
        members: [formData.lead],
      }
      setTeams([...teams, newTeam])
      setFormData({ name: "", lead: "", department: "" })
      setShowForm(false)
    }
  }

  const handleDeleteTeam = (id: string) => {
    setTeams(teams.filter((team) => team.id !== id))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teams</h1>
          <p className="text-muted-foreground mt-2">Manage and organize your teams</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Team
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle>Create New Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Team Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Engineering"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Team Lead</label>
              <input
                type="text"
                value={formData.lead}
                onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
                placeholder="e.g., John Doe"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Department</option>
                <option value="Tech">Tech</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAddTeam} className="flex-1">
                Create Team
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{team.name}</CardTitle>
                  <CardDescription className="mt-1">{team.department}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTeam(team.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Team Lead</p>
                <p className="font-semibold text-foreground">{team.lead}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Team Members</p>
                <div className="space-y-1">
                  {team.members.slice(0, 3).map((member, idx) => (
                    <p key={idx} className="text-sm text-foreground">
                      • {member}
                    </p>
                  ))}
                  {team.memberCount > 3 && (
                    <p className="text-sm text-primary font-medium">+{team.memberCount - 3} more members</p>
                  )}
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-sm font-medium text-foreground">
                  Total Members: <span className="text-primary">{team.memberCount}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
