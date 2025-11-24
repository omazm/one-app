"use server"

import { db } from "@/lib/db"
import { interviewSchema } from "@/lib/validations/interview"
import { revalidatePath } from "next/cache"

export type FormState = {
  success: boolean
  error?: string
  data?: any
}

export async function createInterviewAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const rawData = {
      candidateId: formData.get("candidateId") as string,
      position: formData.get("position") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      interviewer: formData.get("interviewer") as string,
      location: formData.get("location") as string,
      status: formData.get("status") as string,
      notes: formData.get("notes") as string,
    }

    const validatedData = interviewSchema.parse(rawData)

    const interview = await db.interview.create({
      data: {
        candidateId: validatedData.candidateId,
        position: validatedData.position,
        date: new Date(validatedData.date),
        time: validatedData.time,
        interviewer: validatedData.interviewer,
        location: validatedData.location,
        status: validatedData.status,
        notes: validatedData.notes || null,
      },
    })

    revalidatePath("/jobs/interviews")

    return {
      success: true,
      data: interview,
    }
  } catch (error) {
    console.error("Error creating interview:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to schedule interview",
    }
  }
}

export async function updateInterviewAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const id = formData.get("id") as string

    if (!id) {
      return {
        success: false,
        error: "Interview ID is required",
      }
    }

    const rawData = {
      candidateId: formData.get("candidateId") as string,
      position: formData.get("position") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      interviewer: formData.get("interviewer") as string,
      location: formData.get("location") as string,
      status: formData.get("status") as string,
      notes: formData.get("notes") as string,
    }

    const validatedData = interviewSchema.parse(rawData)

    const interview = await db.interview.update({
      where: { id },
      data: {
        candidateId: validatedData.candidateId,
        position: validatedData.position,
        date: new Date(validatedData.date),
        time: validatedData.time,
        interviewer: validatedData.interviewer,
        location: validatedData.location,
        status: validatedData.status,
        notes: validatedData.notes || null,
      },
    })

    revalidatePath("/jobs/interviews")

    return {
      success: true,
      data: interview,
    }
  } catch (error) {
    console.error("Error updating interview:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update interview",
    }
  }
}

export async function getInterviews() {
  try {
    const interviews = await db.interview.findMany({
      include: {
        candidate: true,
      },
      orderBy: {
        date: "asc",
      },
    })

    return {
      success: true,
      data: interviews,
    }
  } catch (error) {
    console.error("Error fetching interviews:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch interviews",
      data: [],
    }
  }
}

export async function deleteInterview(id: string) {
  try {
    await db.interview.delete({
      where: { id },
    })

    revalidatePath("/jobs/interviews")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting interview:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete interview",
    }
  }
}

export async function updateInterviewStatus(id: string, status: string) {
  try {
    const interview = await db.interview.update({
      where: { id },
      data: {
        status: status.toUpperCase() as "SCHEDULED" | "COMPLETED" | "CANCELLED",
      },
    })

    revalidatePath("/jobs/interviews")

    return {
      success: true,
      data: interview,
    }
  } catch (error) {
    console.error("Error updating interview status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update interview status",
    }
  }
}
