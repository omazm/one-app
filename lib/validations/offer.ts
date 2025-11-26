import { z } from "zod"

export const offerSchema = z.object({
  candidateId: z.string().min(1, "Please select a candidate"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  salary: z.string().min(1, "Salary is required"),
  startDate: z.string().min(1, "Start date is required"),
  status: z.enum(["DRAFT", "SENT", "ACCEPTED", "REJECTED"]),
  notes: z.string().optional(),
})

export type OfferFormData = z.infer<typeof offerSchema>
