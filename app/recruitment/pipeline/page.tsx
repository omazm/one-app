import { getPipelines } from "./actions"
import PipelineClient from "./pipeline-client"

export default async function PipelineScreen() {
  const { data: pipelines } = await getPipelines()

  return <PipelineClient pipelines={pipelines || []} />
}
