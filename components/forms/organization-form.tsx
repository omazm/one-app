"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createOrganization, updateOrganization } from "@/app/users/actions"
import { toast } from "sonner"
import { PlusCircle } from "lucide-react"

interface OrganizationDialogProps {
  organization?: {
    id: string
    name: string
    slug?: string | null
    logo?: string | null
  }
  trigger?: React.ReactNode
}

export function OrganizationDialog({ organization, trigger }: OrganizationDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: organization?.name || "",
    slug: organization?.slug || "",
    logo: organization?.logo || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = organization
        ? await updateOrganization(organization.id, formData)
        : await createOrganization(formData)

      if (result.success) {
        toast.success(
          organization ? "Organization updated successfully" : "Organization created successfully"
        )
        setOpen(false)
        setFormData({ name: "", slug: "", logo: "" })
      } else {
        toast.error(result.error || "Failed to save organization")
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Organization
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {organization ? "Edit Organization" : "Create Organization"}
          </DialogTitle>
          <DialogDescription>
            {organization
              ? "Update the organization details below."
              : "Add a new organization to your system."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Acme Corp"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (Optional)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="acme-corp"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL (Optional)</Label>
            <Input
              id="logo"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              placeholder="https://example.com/logo.png"
              type="url"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : organization ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
