import { CampaignPage } from "@/components/campaign-page"

export default function Campaign({ params }: { params: { address: string } }) {
  return <CampaignPage contractAddress={params.address} />
}
