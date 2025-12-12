import { getJobPostings } from "./actions"
import JobListClient from "./job-list-client"
import { requireAuth } from "@/lib/auth-helpers"

export default async function JobPostingsScreen() {
  await requireAuth()
  const { data: jobs } = await getJobPostings()

  return <JobListClient jobs={jobs || []} />
}
