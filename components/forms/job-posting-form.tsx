"use client"

import { useActionState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { createJobPostingAction, updateJobPostingAction, type FormState } from "@/app/jobs/postings/actions"
import { toast } from "sonner"

interface JobPosting {
  id: string
  title: string
  department: string
  location: string
  salary: string
  description: string | null
  status: string
  applicants: number
}

interface JobPostingFormProps {
  onClose: () => void
  onSuccess?: () => void
  job?: JobPosting
}

const initialState: FormState = {
  success: false,
}

export default function JobPostingForm({ onClose, onSuccess, job }: JobPostingFormProps) {
  const isEditing = !!job
  const action = isEditing ? updateJobPostingAction : createJobPostingAction
  const [state, formAction, isPending] = useActionState(action, initialState)

  useEffect(() => {
    if (state.success) {
      toast.success(isEditing ? "Job posting updated successfully" : "Job posting created successfully")
      onSuccess?.()
      onClose()
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state, onSuccess, onClose, isEditing])

  return (
    <form action={formAction} className="space-y-4">
      {isEditing && <input type="hidden" name="id" value={job.id} />}
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="title">Job Title</FieldLabel>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Senior Frontend Developer"
              defaultValue={job?.title}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="department">Department</FieldLabel>
            <Input
              id="department"
              name="department"
              placeholder="e.g., Engineering"
              defaultValue={job?.department}
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <Input
              id="location"
              name="location"
              placeholder="e.g., San Francisco, CA"
              defaultValue={job?.location}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="salary">Salary Range</FieldLabel>
            <Input
              id="salary"
              name="salary"
              placeholder="e.g., $150K - $200K"
              defaultValue={job?.salary}
              required
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="status">Status</FieldLabel>
          <Select name="status" defaultValue={job?.status.toLowerCase() || "draft"} required>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <textarea
            id="description"
            name="description"
            placeholder="Job description and requirements..."
            defaultValue={job?.description || ""}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
            rows={4}
          />
        </Field>
      </FieldGroup>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Posting" : "Create Posting")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
