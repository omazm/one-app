"use server"

import { db } from "@/lib/db"
import { jobPostingSchema } from "@/lib/validations/job-posting"
import { revalidatePath } from "next/cache"

export type FormState = {
  success: boolean
  error?: string
  data?: any
}

export async function createJobPostingAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // Extract form data
    const rawData = {
      title: formData.get("title") as string,
      department: formData.get("department") as string,
      location: formData.get("location") as string,
      salary: formData.get("salary") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as "draft" | "active" | "closed",
    }

    // Validate the data
    const validatedData = jobPostingSchema.parse(rawData)

    // Create the job posting in the database
    const jobPosting = await db.jobPosting.create({
      data: {
        title: validatedData.title,
        department: validatedData.department,
        location: validatedData.location,
        salary: validatedData.salary,
        description: validatedData.description || null,
        status: validatedData.status.toUpperCase() as "DRAFT" | "ACTIVE" | "CLOSED",
        applicants: 0,
      },
    })

    // Revalidate the jobs page
    revalidatePath("/jobs/postings")

    return {
      success: true,
      data: jobPosting,
    }
  } catch (error) {
    console.error("Error creating job posting:", error)
    if (error instanceof Error && error.message.includes("ZodError")) {
      return {
        success: false,
        error: "Please check all required fields",
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create job posting",
    }
  }
}

export async function createJobPosting(data: any) {
  try {
    // Validate the data
    const validatedData = jobPostingSchema.parse(data)

    // Create the job posting in the database
    const jobPosting = await db.jobPosting.create({
      data: {
        title: validatedData.title,
        department: validatedData.department,
        location: validatedData.location,
        salary: validatedData.salary,
        description: validatedData.description || null,
        status: validatedData.status.toUpperCase() as "DRAFT" | "ACTIVE" | "CLOSED",
        applicants: 0,
      },
    })

    // Revalidate the jobs page
    revalidatePath("/jobs/postings")

    return {
      success: true,
      data: jobPosting,
    }
  } catch (error) {
    console.error("Error creating job posting:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create job posting",
    }
  }
}

export async function getJobPostings() {
  try {
    const jobPostings = await db.jobPosting.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return {
      success: true,
      data: jobPostings,
    }
  } catch (error) {
    console.error("Error fetching job postings:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch job postings",
      data: [],
    }
  }
}

export async function updateJobPostingAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const id = formData.get("id") as string
    
    if (!id) {
      return {
        success: false,
        error: "Job posting ID is required",
      }
    }

    // Extract form data
    const rawData = {
      title: formData.get("title") as string,
      department: formData.get("department") as string,
      location: formData.get("location") as string,
      salary: formData.get("salary") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as "draft" | "active" | "closed",
    }

    // Validate the data
    const validatedData = jobPostingSchema.parse(rawData)

    // Update the job posting in the database
    const jobPosting = await db.jobPosting.update({
      where: { id },
      data: {
        title: validatedData.title,
        department: validatedData.department,
        location: validatedData.location,
        salary: validatedData.salary,
        description: validatedData.description || null,
        status: validatedData.status.toUpperCase() as "DRAFT" | "ACTIVE" | "CLOSED",
      },
    })

    // Revalidate the jobs page
    revalidatePath("/jobs/postings")

    return {
      success: true,
      data: jobPosting,
    }
  } catch (error) {
    console.error("Error updating job posting:", error)
    if (error instanceof Error && error.message.includes("ZodError")) {
      return {
        success: false,
        error: "Please check all required fields",
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update job posting",
    }
  }
}

export async function deleteJobPosting(id: string) {
  try {
    await db.jobPosting.delete({
      where: { id },
    })

    revalidatePath("/jobs/postings")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting job posting:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete job posting",
    }
  }
}
