import { CampaignPage } from "@/components/campaign-page"

export default async function Campaign({
  params,
}: {
  params: Promise<{ address: string }>
}) {
  const { address } = await params
  return <CampaignPage contractAddress={address} />
}
