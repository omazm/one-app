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
import { removeMember, updateMemberRole } from "../actions"
import { toast } from "sonner"
import { Trash2, UserCog, Users as UsersIcon } from "lucide-react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Member {
  id: string
  role: string
  userId: string
  user: {
    name: string
    email: string
    image?: string | null
  }
  createdAt: string
}

interface MemberListProps {
  members: Member[]
  organizationId: string
}

export function MemberList({ members, organizationId }: MemberListProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleRemove = async (userId: string) => {
    setLoading(userId)
    try {
      const result = await removeMember({
        organizationId,
        userId,
      })
      if (result.success) {
        toast.success("Member removed successfully")
      } else {
        toast.error(result.error || "Failed to remove member")
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
    } finally {
      setLoading(null)
    }
  }

  const handleRoleChange = async (userId: string, role: string) => {
    setLoading(userId)
    try {
      const result = await updateMemberRole({
        organizationId,
        userId,
        role,
      })
      if (result.success) {
        toast.success("Role updated successfully")
      } else {
        toast.error(result.error || "Failed to update role")
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
    } finally {
      setLoading(null)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center py-8">
                  <UsersIcon className="h-12 w-12 mb-2 opacity-20" />
                  <p>No members found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.user.image || undefined} />
                      <AvatarFallback>{getInitials(member.user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.user.name}</div>
                      <div className="text-sm text-muted-foreground">{member.user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={member.role === "owner" ? "default" : "secondary"}>
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(member.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={loading === member.userId}>
                          <UserCog className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(member.userId, "owner")}
                          disabled={member.role === "owner"}
                        >
                          Make Owner
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(member.userId, "admin")}
                          disabled={member.role === "admin"}
                        >
                          Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(member.userId, "member")}
                          disabled={member.role === "member"}
                        >
                          Make Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={loading === member.userId}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Member</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {member.user.name} from the organization?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRemove(member.userId)}>
                            Remove
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
