import { GlassModal } from "@/components/global/glass-modal"
import { JoinGroupPaymentForm } from "@/components/global/join-group"
import { StripeElements } from "@/components/global/stripe/elements"
import { Button } from "@/components/ui/button"
import { useActiveGroupSubscription, useJoinFree } from "@/hooks/payment"

type JoinButtonProps = {
    owner: boolean
    groupid: string
    userid: string
}

export const JoinButton = ({ owner, groupid, userid }: JoinButtonProps) => {
    const { data } = useActiveGroupSubscription(groupid)
    const { onJoinFreeGroup } = useJoinFree(groupid)

    // Handle error state
    if (!data) {
        return (
            <div className="w-full p-10 text-center text-green-500">
                Loading...
            </div>
        )
    }

    // Check if the user is already a member
    const isMember = Object.values(data?.members || {}).some(
        (member) => member === userid,
    )

    // If the user is the owner
    if (owner) {
        return (
            <Button disabled className="w-full p-10" variant="ghost">
                Owner
            </Button>
        )
    }

    // If the user is already a member
    if (isMember) {
        return (
            <div className="w-full p-10 text-center text-themeTextGray">
                Member
            </div>
        )
    }

    // If the group requires a subscription
    if (data.subscription?.price) {
        return (
            <GlassModal
                trigger={
                    <Button className="w-full p-8" variant="ghost">
                        <p className="text-lg text-green-500">
                            ${data.subscription.price} / month
                        </p>
                    </Button>
                }
                title="Join group"
                description="Pay now to join this community"
            >
                <StripeElements>
                    <p className="text-sm text-gray-500 text-center">
                        By subscribing, you agree to our terms and conditions.
                        Payments are handled securely through Stripe.
                    </p>
                    <JoinGroupPaymentForm groupid={groupid} />
                </StripeElements>
            </GlassModal>
        )
    }

    // Free group join button
    return (
        <Button
            onClick={onJoinFreeGroup}
            className="w-full p-10"
            variant="ghost"
        >
            Join now
        </Button>
    )
}
