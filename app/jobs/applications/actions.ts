"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type ApplicationFormState = {
  success: boolean
  error?: string
  data?: any
}

export async function getApplications() {
  try {
    const applications = await db.application.findMany({
      include: {
        candidate: true,
        job: true,
      },
      orderBy: {
        appliedDate: "desc",
      },
    })

    return {
      success: true,
      data: applications,
    }
  } catch (error) {
    console.error("Error fetching applications:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch applications",
      data: [],
    }
  }
}

export async function updateApplicationStatus(id: string, status: string) {
  try {
    const application = await db.application.update({
      where: { id },
      data: {
        status: status.toUpperCase() as "NEW" | "REVIEWING" | "SHORTLISTED" | "REJECTED",
      },
    })

    revalidatePath("/jobs/applications")

    return {
      success: true,
      data: application,
    }
  } catch (error) {
    console.error("Error updating application status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update application status",
    }
  }
}

export async function deleteApplication(id: string) {
  try {
    await db.application.delete({
      where: { id },
    })

    revalidatePath("/jobs/applications")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting application:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete application",
    }
  }
}
