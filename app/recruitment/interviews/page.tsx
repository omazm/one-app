import { getInterviews } from "./actions"
import { getCandidates } from "../candidates/actions"
import InterviewsClient from "./interviews-client"


export default async function InterviewScreen() {
  const { data: interviews } = await getInterviews()
  const candidates = await getCandidates()

  return <InterviewsClient interviews={interviews || []} candidates={candidates} />
}
