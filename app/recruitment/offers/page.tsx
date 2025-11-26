import { getOffers } from "./actions"
import { getCandidates } from "../candidates/actions"
import OffersClient from "./offers-client"


export default async function OffersScreen() {
  const { data: offers } = await getOffers()
  const candidates = await getCandidates()

  return <OffersClient offers={offers || []} candidates={candidates} />
}
