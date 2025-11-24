"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type PipelineFormState = {
  success: boolean
  error?: string
  data?: any
}

export async function getPipelines() {
  try {
    const pipelines = await db.pipeline.findMany({
      include: {
        candidate: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return {
      success: true,
      data: pipelines,
    }
  } catch (error) {
    console.error("Error fetching pipelines:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch pipelines",
      data: [],
    }
  }
}

export async function updatePipelineStage(id: string, stage: string) {
  try {
    const pipeline = await db.pipeline.update({
      where: { id },
      data: {
        stage: stage.toUpperCase() as "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "HIRED",
      },
    })

    revalidatePath("/jobs/pipeline")

    return {
      success: true,
      data: pipeline,
    }
  } catch (error) {
    console.error("Error updating pipeline stage:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update pipeline stage",
    }
  }
}

export async function deletePipeline(id: string) {
  try {
    await db.pipeline.delete({
      where: { id },
    })

    revalidatePath("/jobs/pipeline")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting pipeline:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete pipeline",
    }
  }
}
