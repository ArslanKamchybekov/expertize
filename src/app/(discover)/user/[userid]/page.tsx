import { Button } from "@/components/ui/button"

type Props = {
    user: {
        id: string
        username: string
        image: string
    }
    groups: {
        id: string
        name: string
        icon: string
        userId: string
    }[]
    subscriptions: {
        id: string
        price: number
        groupId: string
        active: boolean
        createdAt: number
    }[]
}

const UserProfilePage = async (props: Props) => {
    // Add detailed logging

    console.log("Received User:", props.user)
    console.log("Received Groups:", props.groups)
    console.log("Received Subscriptions:", props.subscriptions)

    const { user, groups, subscriptions } = props

    // Early return if no user
    if (!user) {
        return <div>Loading or no user found</div>
    }

    const handleCancelSubscription = async (
        subscriptionId: string,
        groupId: string,
    ) => {
        try {
            console.log(
                `Cancelling subscription ${subscriptionId} for group ${groupId}`,
            )
        } catch (error) {
            console.error("Failed to cancel subscription:", error)
        }
    }

    return (
        <>
            {/* Profile Section */}
            <div className="flex flex-col items-center text-center gap-4">
                <img
                    src={user.image}
                    alt={`${user.username}'s avatar`}
                    className="w-20 h-20 rounded-full border-4 object-cover shadow-lg"
                />
                <p className="text-3xl font-bold">{user.username}</p>
            </div>

            {/* Groups Section */}
            <section className="w-full mt-10">
                <h2 className="text-2xl font-bold text-white mb-6">
                    Your Groups
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.length > 0 ? (
                        groups.map((group) => (
                            <div
                                key={group.id}
                                className="p-6 bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 flex flex-col items-center gap-4"
                            >
                                <img
                                    src={`https://ucarecdn.com/${group.icon || ""}/`}
                                    alt="icon"
                                    className="w-10 h-10 rounded-lg"
                                />
                                <p className="text-gray-400">
                                    {group.userId === user.id
                                        ? "Owner"
                                        : "Member"}
                                </p>
                                <h3 className="text-xl font-semibold text-white">
                                    {group.name}
                                </h3>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center">
                            <p className="text-gray-400">
                                You are not a member of any groups yet.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Subscriptions Section */}
            <section className="w-full mt-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                    Your Subscriptions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subscriptions.length > 0 ? (
                        subscriptions.map((subscription) => (
                            <div
                                key={subscription.id}
                                className="p-6 bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
                            >
                                <h3 className="text-xl font-semibold text-white">
                                    ${subscription.price} / month
                                </h3>
                                <p className="text-gray-400 mt-2">
                                    {
                                        groups.find(
                                            (group) =>
                                                group.id ===
                                                subscription.groupId,
                                        )?.name
                                    }
                                </p>
                                <p className="text-gray-400 mt-2">
                                    {subscription.active
                                        ? "Active"
                                        : "Inactive"}
                                </p>
                                <p className="text-gray-400 mt-2">
                                    Date:{" "}
                                    {new Date(
                                        subscription.createdAt,
                                    ).toLocaleDateString()}
                                </p>
                                <Button
                                    className="mt-4"
                                    variant="outline"
                                    onClick={() =>
                                        handleCancelSubscription(
                                            subscription.id,
                                            subscription.groupId,
                                        )
                                    }
                                >
                                    Cancel Subscription
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center">
                            <p className="text-gray-400">
                                You have no active subscriptions.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

export default UserProfilePage
