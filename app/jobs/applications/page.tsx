import { getApplications } from "./actions"
import ApplicationsListClient from "./applications-list-client"

export default async function ApplicationsScreen() {
  const { data: applications } = await getApplications()

  return <ApplicationsListClient applications={applications || []} />
}
