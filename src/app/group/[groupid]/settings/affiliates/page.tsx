import { onGetAffiliateLink } from "@/actions/groups"
import { CopyButton } from "@/components/global/copy-button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"

type Props = {
    params: { groupid: string }
}

const Affiliate = async ({ params }: Props) => {
    const affiliate = await onGetAffiliateLink(params.groupid)
    return (
        <div className="flex flex-col items-start p-5">
            <Card className="border-themeGray bg-[#1A1A1D] p-5">
                <CardTitle className="text-3xl">Affiliate Link</CardTitle>
                <CardDescription className="text-themeTextGray my-4">
                    This link will redirect users to the main page where they
                    can purchase or request memberships
                </CardDescription>
                <div className="flex flex-col gap-y-2 mt-2">
                    <div className="bg-black border-themeGray p-3 rounded-lg flex gap-x-5 items-center">
                        {process.env.NEXT_PUBLIC_API_URL}/affiliates/
                        {affiliate.affiliate?.id}
                        <CopyButton
                            content={`${process.env.NEXT_PUBLIC_API_URL}/affiliates/${affiliate.affiliate?.id}`}
                        />
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default Affiliate
