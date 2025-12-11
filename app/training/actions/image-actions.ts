"use server"

import { readdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function getTrainerImages() {
  try {
    const uploadDir = join(process.cwd(), "public", "uploads", "trainers")
    
    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      return []
    }

    const files = await readdir(uploadDir)
    
    // Filter for image files and return public URLs
    const imageFiles = files
      .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map((file) => `/uploads/trainers/${file}`)
      .sort()
      .reverse() // Most recent first

    return imageFiles
  } catch (error) {
    console.error("Error reading trainer images:", error)
    return []
  }
}
