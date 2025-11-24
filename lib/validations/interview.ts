import { z } from "zod"

export const interviewSchema = z.object({
  candidateId: z.string().min(1, "Please select a candidate"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  interviewer: z.string().min(2, "Interviewer name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]),
  notes: z.string().optional(),
})

export type InterviewFormData = z.infer<typeof interviewSchema>
