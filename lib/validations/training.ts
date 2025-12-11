import { z } from "zod"

export const trainingSchema = z.object({
  trainerName: z.string().min(1, "Trainer name is required"),
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.array(z.string()).default([]),
  trainerPhotoUrl: z.string().nullable().optional(),
})

export type TrainingFormData = z.infer<typeof trainingSchema>
