"use client"

import { useActionState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { offerSchema, type OfferFormData } from "@/lib/validations/offer"
import { toast } from "sonner"

interface Offer {
  id: string
  candidateId: string
  position: string
  salary: string
  startDate: string
  notes?: string | null
  status: string
}

interface Candidate {
  id: string
  name: string
  email: string
}

interface OfferFormProps {
  onClose: () => void
  onSuccess?: () => void
  offer?: Offer
  candidates: Candidate[]
  action?: (prevState: any, formData: FormData) => Promise<any>
}

const initialState = {
  success: false,
}

export default function OfferForm({ onClose, onSuccess, offer, candidates, action }: OfferFormProps) {
  const isEditing = !!offer
  const hasAction = !!action
  const [state, formAction, isPending] = useActionState(action || (async () => initialState), initialState)

  const {
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      status: "DRAFT",
    },
  })

  // Reset form when offer changes (for editing)
  useEffect(() => {
    if (offer) {
      reset({
        candidateId: offer.candidateId,
        position: offer.position,
        salary: offer.salary,
        startDate: offer.startDate,
        status: offer.status as "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED",
        notes: offer.notes || "",
      })
    } else {
      reset({
        candidateId: undefined as any,
        position: "",
        salary: "",
        startDate: "",
        status: "DRAFT",
        notes: "",
      })
    }
  }, [offer, reset])

  useEffect(() => {
    if (hasAction && state.success) {
      toast.success(isEditing ? "Offer updated successfully" : "Offer created successfully")
      onSuccess?.()
      onClose()
    } else if (hasAction && state.error) {
      toast.error(state.error)
    }
  }, [state, onSuccess, onClose, isEditing, hasAction])

  return (
    <form action={hasAction ? formAction : undefined} className="space-y-4">
      {isEditing && <input type="hidden" name="id" value={offer.id} />}
      
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="candidateId">Candidate</FieldLabel>
            <Controller
              name="candidateId"
              control={control}
              render={({ field }) => (
                <Select
                  key={offer?.id || 'new'}
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
            <FieldLabel htmlFor="salary">Salary</FieldLabel>
            <Input
              id="salary"
              placeholder="e.g., $120,000 or $80K - $100K"
              {...register("salary")}
            />
            {errors.salary && (
              <FieldError>{errors.salary.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
            <Input
              id="startDate"
              type="date"
              {...register("startDate")}
            />
            {errors.startDate && (
              <FieldError>{errors.startDate.message}</FieldError>
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
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="SENT">Sent</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
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
            placeholder="Additional notes about the offer..."
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
          {isPending ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Offer" : "Create Offer")}
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
