"use client"

import { useActionState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { interviewSchema, type InterviewFormData } from "@/lib/validations/interview"
import { toast } from "sonner"

interface Interview {
  id: string
  candidateId: string
  candidateName?: string
  position: string
  date: string
  time: string
  interviewer: string
  location: string
  notes?: string | null
  status: string
}

interface Candidate {
  id: string
  name: string
  email: string
}

interface InterviewFormProps {
  onClose: () => void
  onSuccess?: () => void
  interview?: Interview
  candidates: Candidate[]
  action?: (prevState: any, formData: FormData) => Promise<any>
  onAdd?: (interview: any) => void
}

const initialState = {
  success: false,
}

export default function InterviewForm({ onClose, onSuccess, interview, candidates, action, onAdd }: InterviewFormProps) {
  const isEditing = !!interview
  const hasAction = !!action
  const [state, formAction, isPending] = useActionState(action || (async () => initialState), initialState)

  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit: handleFormSubmit,
  } = useForm<InterviewFormData>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      status: "SCHEDULED",
    },
  })

  // Reset form when interview changes (for editing)
  useEffect(() => {
    if (interview) {
      reset({
        candidateId: interview.candidateId,
        position: interview.position,
        date: interview.date,
        time: interview.time,
        interviewer: interview.interviewer,
        location: interview.location,
        status: interview.status as "SCHEDULED" | "COMPLETED" | "CANCELLED",
        notes: interview.notes || "",
      })
    } else {
      reset({
        candidateId: undefined as any,
        position: "",
        date: "",
        time: "",
        interviewer: "",
        location: "",
        status: "SCHEDULED",
        notes: "",
      })
    }
  }, [interview, reset])

  useEffect(() => {
    if (hasAction && state.success) {
      toast.success(isEditing ? "Interview updated successfully" : "Interview scheduled successfully")
      onSuccess?.()
      onClose()
    } else if (hasAction && state.error) {
      toast.error(state.error)
    }
  }, [state, onSuccess, onClose, isEditing, hasAction])

  const handleLegacySubmit = (e: React.FormEvent) => {
    if (!hasAction && onAdd) {
      e.preventDefault()
      handleFormSubmit((data) => {
        onAdd({
          ...data,
          status: "scheduled",
        })
        onClose()
      })(e)
    }
  }

  return (
    <form action={hasAction ? formAction : undefined} onSubmit={handleLegacySubmit} className="space-y-4">
      {isEditing && <input type="hidden" name="id" value={interview.id} />}
      
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="candidateId">Candidate</FieldLabel>
            <Controller
              name="candidateId"
              control={control}
              render={({ field }) => (
                <Select
                  key={interview?.id || 'new'}
                  onValueChange={field.onChange}
                  value={field.value}
                  name="candidateId"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((candidate) => (
                      <SelectItem key={candidate.id} value={candidate.id}>
                        {candidate.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.candidateId && (
              <FieldError>{errors.candidateId.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="position">Position</FieldLabel>
            <Input
              id="position"
              placeholder="Position title"
              {...register("position")}
            />
            {errors.position && (
              <FieldError>{errors.position.message}</FieldError>
            )}
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="date">Date</FieldLabel>
            <Input
              id="date"
              type="date"
              {...register("date")}
            />
            {errors.date && (
              <FieldError>{errors.date.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="time">Time</FieldLabel>
            <Input
              id="time"
              type="time"
              {...register("time")}
            />
            {errors.time && (
              <FieldError>{errors.time.message}</FieldError>
            )}
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="interviewer">Interviewer</FieldLabel>
            <Input
              id="interviewer"
              placeholder="Interviewer name"
              {...register("interviewer")}
            />
            {errors.interviewer && (
              <FieldError>{errors.interviewer.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <Input
              id="location"
              placeholder="e.g., Conference Room A or Zoom"
              {...register("location")}
            />
            {errors.location && (
              <FieldError>{errors.location.message}</FieldError>
            )}
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="status">Status</FieldLabel>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                name="status"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <FieldError>{errors.status.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="notes">Notes (Optional)</FieldLabel>
          <textarea
            id="notes"
            placeholder="Additional notes about the interview..."
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-20"
            {...register("notes")}
            rows={3}
          />
          {errors.notes && (
            <FieldError>{errors.notes.message}</FieldError>
          )}
        </Field>
      </FieldGroup>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? (isEditing ? "Updating..." : "Scheduling...") : (isEditing ? "Update Interview" : "Schedule Interview")}
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
