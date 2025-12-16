import { getOrganizations } from "../actions"
import { OrganizationDialog } from "@/components/forms/organization-form"
import { OrganizationList } from "./organization-list"

export default async function OrganizationsPage() {
  const result = await getOrganizations()
  const organizations = (result.data || []).map((org) => ({
    ...org,
    createdAt: org.createdAt.toISOString(),
  }))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Organizations</h3>
          <p className="text-sm text-muted-foreground">
            Manage your organizations and team members
          </p>
        </div>
        <OrganizationDialog />
      </div>
      <OrganizationList organizations={organizations} />
    </div>
  )
}
