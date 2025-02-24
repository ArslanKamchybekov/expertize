import { onGetAffiliateLink } from "@/actions/groups"
import { CopyButton } from "@/components/global/copy-button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"

type Props = {
    params: { groupid: string }
}

const Affiliate = async ({ params }: Props) => {
    const affiliate = await onGetAffiliateLink(params.groupid)
    const affiliateLink = `${process.env.NEXT_PUBLIC_API_URL}/affiliates/${affiliate.affiliate?.id}`

    return (
        <div className="flex flex-col items-start p-4 sm:p-6">
            <Card className="border-themeGray bg-[#1A1A1D] p-5 w-full max-w-lg">
                <CardTitle className="text-2xl sm:text-3xl">Affiliate Link</CardTitle>
                <CardDescription className="text-themeTextGray mt-3 sm:mt-4">
                    This link will redirect users to the main page where they
                    can purchase or request memberships.
                </CardDescription>
                <div className="flex flex-col gap-3 mt-4">
                    <div className="bg-black border-themeGray p-3 rounded-lg flex flex-wrap gap-3 sm:gap-5 items-center w-full break-all">
                        <span className="text-sm sm:text-base">{affiliateLink}</span>
                        <CopyButton content={affiliateLink} />
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default Affiliate
