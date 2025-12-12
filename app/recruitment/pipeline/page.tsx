import { getPipelines } from "./actions"
import PipelineClient from "./pipeline-client"
import { requireAuth } from "@/lib/auth-helpers"

export default async function PipelinePage() {
  await requireAuth()
  const { data: pipelines } = await getPipelines()

  return <PipelineClient pipelines={pipelines || []} />
}
