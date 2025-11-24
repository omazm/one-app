import { getJobPostings } from "./actions"
import JobListClient from "./job-list-client"

export default async function JobPostingsScreen() {
  const { data: jobs } = await getJobPostings()

  return <JobListClient jobs={jobs || []} />
}
