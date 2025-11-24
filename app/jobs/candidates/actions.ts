"use server"

import { db } from "@/lib/db"

export async function getCandidates() {
  try {
    const candidates = await db.candidate.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    })

    return candidates
  } catch (error) {
    console.error("Error fetching candidates:", error)
    throw new Error("Failed to fetch candidates")
  }
}

export async function getCandidateById(id: string) {
  try {
    const candidate = await db.candidate.findUnique({
      where: { id },
      include: {
        applications: {
          include: {
            job: true,
          },
        },
        interviews: true,
        pipelines: true,
      },
    })

    return candidate
  } catch (error) {
    console.error("Error fetching candidate:", error)
    throw new Error("Failed to fetch candidate")
  }
}
