import { z } from "zod"

export const jobPostingSchema = z.object({
  title: z.string().min(1, "Job title is required").max(100, "Title must be less than 100 characters"),
  department: z.string().min(1, "Department is required").max(50, "Department must be less than 50 characters"),
  location: z.string().min(1, "Location is required").max(100, "Location must be less than 100 characters"),
  salary: z.string().min(1, "Salary range is required").max(50, "Salary must be less than 50 characters"),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "closed"]),
})

export type JobPostingFormData = z.infer<typeof jobPostingSchema>
