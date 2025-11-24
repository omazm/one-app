import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, MapPin, DollarSign, Users, Briefcase } from "lucide-react"
import { getJobPostings } from "./actions"


export default async function JobPostingsScreen() {
  const { data: jobs } = await getJobPostings()

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Job Postings</h2>
          <p className="text-muted-foreground mt-1">Manage and track open positions</p>
        </div>
      
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {jobs?.map((job) => (
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
              <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
             
            </div>
          </Card>
        ))}
      </div>

      {(!jobs || jobs.length === 0) && (
        <Card className="p-12 text-center">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No job postings yet. Create your first one!</p>
        </Card>
      )}
    </div>
  )
}
