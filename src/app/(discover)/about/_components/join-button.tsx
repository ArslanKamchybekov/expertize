import { GlassModal } from "@/components/global/glass-modal"
import { JoinGroupPaymentForm } from "@/components/global/join-group"
import { StripeElements } from "@/components/global/stripe/elements"
import { Button } from "@/components/ui/button"
import { useActiveGroupSubscription, useJoinFree } from "@/hooks/payment"

type JoinButtonProps = {
    owner: boolean
    groupid: string
}

export const JoinButton = ({ owner, groupid }: JoinButtonProps) => {
    const { data } = useActiveGroupSubscription(groupid)
    const { onJoinFreeGroup } = useJoinFree(groupid)

    if (owner) {
        // If the user is the owner, disable the button and show "Owner"
        return (
            <Button disabled className="w-full p-10" variant="ghost">
                Owner
            </Button>
        )
    }

    if (data?.status === 200) {
        // If the user has already joined the group
        return (
            <div className="w-full p-10 text-center text-themeTextGray">
                Already a member
            </div>
        )
    }

    // If the user has not joined, display the appropriate join button
    if (data?.subscription?.price) {
        // Show subscription join button
        return (
            <GlassModal
                trigger={
                    <Button className="w-full p-10" variant="ghost">
                        <p>Join ${data.subscription.price}/Month</p>
                    </Button>
                }
                title="Join this group"
                description="Pay now to join this community"
            >
                <StripeElements>
                    <JoinGroupPaymentForm groupid={groupid} />
                </StripeElements>
            </GlassModal>
        )
    }

    // Show free join button
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
