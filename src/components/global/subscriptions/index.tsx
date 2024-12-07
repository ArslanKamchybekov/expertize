"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

type Props = {
    subscriptions: {
        id: string
        price: number
        groupId: string
        active: boolean
        createdAt: number
    }[]
    groups: {
        id: string
        name: string
        icon: string
        userId: string
    }[]
}

export default function Subscriptions({ subscriptions, groups }: Props) {
    const [currentSubscriptions, setCurrentSubscriptions] =
        useState(subscriptions)

    const handleCancelSubscription = async (subscriptionId: string) => {
        try {
            console.log(`Cancelling subscription ${subscriptionId}`)
            // Simulate API call or actual cancellation logic
            setCurrentSubscriptions((prev) =>
                prev.filter((sub) => sub.id !== subscriptionId),
            )
        } catch (error) {
            console.error("Failed to cancel subscription:", error)
        }
    }

    return (
        <section className="w-full mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">
                Your Subscriptions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentSubscriptions.length > 0 ? (
                    currentSubscriptions.map((subscription) => (
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
                                            group.id === subscription.groupId,
                                    )?.name
                                }
                            </p>
                            <p className="text-gray-400 mt-2">
                                {subscription.active ? "Active" : "Inactive"}
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
                                    handleCancelSubscription(subscription.id)
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
    )
}
