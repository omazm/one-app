"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { OrganizationDialog } from "@/components/forms/organization-form"
import { deleteOrganization } from "../actions"
import { toast } from "sonner"
import { Pencil, Trash2, Building2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Organization {
  id: string
  name: string
  slug?: string | null
  logo?: string | null
  createdAt: string
  metadata?: any
  members?: any[]
}

interface OrganizationListProps {
  organizations: Organization[]
}

export function OrganizationList({ organizations }: OrganizationListProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      const result = await deleteOrganization(id)
      if (result.success) {
        toast.success("Organization deleted successfully")
      } else {
        toast.error(result.error || "Failed to delete organization")
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organization</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center py-8">
                  <Building2 className="h-12 w-12 mb-2 opacity-20" />
                  <p>No organizations found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            organizations.map((org) => (
              <TableRow key={org.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={org.logo || undefined} />
                      <AvatarFallback>{org.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{org.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {org.slug || "-"}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {org.members?.length || 0} members
                  </Badge>
                </TableCell>
                <TableCell>{new Date(org.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <OrganizationDialog
                      organization={org}
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={deleting === org.id}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Organization</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {org.name}? This will also delete all
                            associated members and data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(org.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
