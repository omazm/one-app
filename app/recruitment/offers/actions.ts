"use server"

import { db } from "@/lib/db"
import { offerSchema } from "@/lib/validations/offer"
import { revalidatePath } from "next/cache"

export type FormState = {
  success: boolean
  error?: string
  data?: any
}

export async function createOfferAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const rawData = {
      candidateId: formData.get("candidateId") as string,
      position: formData.get("position") as string,
      salary: formData.get("salary") as string,
      startDate: formData.get("startDate") as string,
      status: formData.get("status") as string,
      notes: formData.get("notes") as string,
    }

    const validatedData = offerSchema.parse(rawData)

    const offer = await db.offer.create({
      data: {
        candidateId: validatedData.candidateId,
        position: validatedData.position,
        salary: validatedData.salary,
        startDate: new Date(validatedData.startDate),
        status: validatedData.status,
        notes: validatedData.notes || null,
      },
    })

    revalidatePath("/recruitment/offers")

    return {
      success: true,
      data: offer,
    }
  } catch (error) {
    console.error("Error creating offer:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create offer",
    }
  }
}

export async function updateOfferAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const id = formData.get("id") as string
    if (!id) {
      return {
        success: false,
        error: "Offer ID is required",
      }
    }

    const rawData = {
      candidateId: formData.get("candidateId") as string,
      position: formData.get("position") as string,
      salary: formData.get("salary") as string,
      startDate: formData.get("startDate") as string,
      status: formData.get("status") as string,
      notes: formData.get("notes") as string,
    }

    const validatedData = offerSchema.parse(rawData)

    const offer = await db.offer.update({
      where: { id },
      data: {
        candidateId: validatedData.candidateId,
        position: validatedData.position,
        salary: validatedData.salary,
        startDate: new Date(validatedData.startDate),
        status: validatedData.status,
        notes: validatedData.notes || null,
      },
    })

    revalidatePath("/recruitment/offers")

    return {
      success: true,
      data: offer,
    }
  } catch (error) {
    console.error("Error updating offer:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update offer",
    }
  }
}

export async function getOffers() {
  try {
    const offers = await db.offer.findMany({
      include: {
        candidate: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return {
      success: true,
      data: offers,
    }
  } catch (error) {
    console.error("Error fetching offers:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch offers",
      data: [],
    }
  }
}

export async function deleteOffer(id: string) {
  try {
    await db.offer.delete({
      where: { id },
    })

    revalidatePath("/recruitment/offers")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting offer:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete offer",
    }
  }
}

export async function updateOfferStatus(id: string, status: string) {
  try {
    const offer = await db.offer.update({
      where: { id },
      data: {
        status: status.toUpperCase() as "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED",
      },
    })

    revalidatePath("/recruitment/offers")

    return {
      success: true,
      data: offer,
    }
  } catch (error) {
    console.error("Error updating offer status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update offer status",
    }
  }
}
