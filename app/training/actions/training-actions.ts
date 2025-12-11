"use server"



import type { TrainingStatus } from "../types"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"

export async function createTraining(formData: FormData) {
  const trainerName = formData.get("trainerName") as string
  const title = formData.get("title") as string
  const date = formData.get("date") as string
  const description = formData.get("description") as string
  const tagsString = formData.get("tags") as string
  const photo = formData.get("photo") as File | null

  const tags = tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)

  let trainerPhotoUrl: string | null = null

  if (photo && photo.size > 0) {
    const blob = await put(`trainers/${Date.now()}-${photo.name}`, photo, {
      access: "public",
    })
    trainerPhotoUrl = blob.url
  }

  await db.training.create({
    data: {
      trainerName,
      title,
      date: new Date(date),
      description,
      tags,
      trainerPhotoUrl,
      status: "PENDING",
    },
  })

  revalidatePath("/")
  return { success: true }
}

export async function updateTrainingStatus(id: string, status: TrainingStatus) {
  await db.training.update({
    where: { id },
    data: { status },
  })
  revalidatePath("/")
  return { success: true }
}

export async function deleteTraining(id: string) {
  await db.training.delete({
    where: { id },
  })
  revalidatePath("/")
  return { success: true }
}

export async function getTrainings() {
  return db.training.findMany({
    orderBy: { date: "desc" },
  })
}
