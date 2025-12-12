import { getInterviews } from "./actions"
import { getCandidates } from "../candidates/actions"
import InterviewsClient from "./interviews-client"
import { requireAuth } from "@/lib/auth-helpers"


export default async function InterviewScreen() {
  await requireAuth()
  const { data: interviews } = await getInterviews()
  const candidates = await getCandidates()

  return <InterviewsClient interviews={interviews || []} candidates={candidates} />
}
