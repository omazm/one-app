"use server"

import { supabase } from "@/lib/supabase"

export async function getTrainerImages() {
  try {
    // List all files in the trainers folder
    const { data, error } = await supabase.storage
      .from("trainer-images")
      .list("trainers", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      })

    if (error) {
      console.error("Error listing trainer images:", error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    // Get public URLs for all images
    const imageUrls = data
      .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name))
      .map((file) => {
        const { data: urlData } = supabase.storage
          .from("trainer-images")
          .getPublicUrl(`trainers/${file.name}`)
        return urlData.publicUrl
      })

    return imageUrls
  } catch (error) {
    console.error("Error reading trainer images:", error)
    return []
  }
}
