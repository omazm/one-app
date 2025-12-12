import { getApplications } from "./actions"
import ApplicationsListClient from "./applications-list-client"
import { requireAuth } from "@/lib/auth-helpers"

export default async function ApplicationsPage() {
  await requireAuth()
  const { data: applications } = await getApplications()

  return <ApplicationsListClient applications={applications || []} />
}
