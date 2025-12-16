import { getOrganizations, getActiveOrganization } from "../actions"
import { InviteMemberDialog } from "@/components/forms/invite-member-form"
import { MemberList } from "./member-list"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OrganizationSelector } from "./organization-selector"

export default async function MembersPage() {
  const [orgsResult, activeOrgResult] = await Promise.all([
    getOrganizations(),
    getActiveOrganization(),
  ])

  const organizations = orgsResult.data || []
  const activeOrg = activeOrgResult.data
  const members = (activeOrg?.members || []).map((member) => ({
    ...member,
    createdAt: member.createdAt.toISOString(),
  }))

  if (organizations.length === 0) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>No Organizations</CardTitle>
            <CardDescription>
              Create an organization first to manage members.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 max-w-xs">
          <OrganizationSelector organizations={organizations} activeOrgId={activeOrg?.id} />
        </div>
        {activeOrg && <InviteMemberDialog organizationId={activeOrg.id} organizationName={activeOrg.name} />}
      </div>

      {activeOrg ? (
        <MemberList members={members} organizationId={activeOrg.id} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Select an Organization</CardTitle>
            <CardDescription>
              Choose an organization above to view and manage its members.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
