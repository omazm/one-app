export type TrainingStatus = "PENDING" | "COMPLETED" | "POSTPONED" | "CANCELLED"

export interface Training {
  id: string
  trainerName: string
  title: string
  date: Date
  description: string
  tags: string[]
  trainerPhotoUrl: string | null
  status: TrainingStatus
  createdAt: Date
  updatedAt: Date
}
