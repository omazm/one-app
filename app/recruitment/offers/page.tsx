import { getOffers } from "./actions"
import { getCandidates } from "../candidates/actions"
import OffersClient from "./offers-client"
import { requireAuth } from "@/lib/auth-helpers"


export default async function OffersScreen() {
  await requireAuth()
  const { data: offers } = await getOffers()
  const candidates = await getCandidates()

  return <OffersClient offers={offers || []} candidates={candidates} />
}
