"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { setActiveOrganization } from "@/app/users/actions"
import { toast } from "sonner"

interface Organization {
  id: string
  name: string
}

interface OrganizationSelectorProps {
  organizations: Organization[]
  activeOrgId?: string
}

export function OrganizationSelector({ organizations, activeOrgId }: OrganizationSelectorProps) {
  const handleChange = async (value: string) => {
    const result = await setActiveOrganization(value)
    if (!result.success) {
      toast.error(result.error || "Failed to switch organization")
    }
  }

  return (
    <Select value={activeOrgId} onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select organization" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((org) => (
          <SelectItem key={org.id} value={org.id}>
            {org.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
