import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth-helpers"

export default async function JobsPage() {
  await requireAuth()
  redirect("/recruitment/postings")
}
