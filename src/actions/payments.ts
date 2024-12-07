"use server"
import { client } from "@/lib/prisma"
import Stripe from "stripe"
import { onAuthenticatedUser } from "./auth"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    typescript: true,
    apiVersion: "2024-11-20.acacia",
})

export const onGetStripeClientSecret = async () => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            currency: "usd",
            amount: 9900,
            automatic_payment_methods: {
                enabled: true,
            },
        })

        if (paymentIntent) {
            return { secret: paymentIntent.client_secret }
        }
    } catch (error) {
        return { status: 400, message: "Failed to load form" }
    }
}

export const onTransferCommission = async (destination: string) => {
    try {
        const transfer = await stripe.transfers.create({
            amount: 3960,
            currency: "usd",
            destination: destination,
        })

        if (transfer) {
            return { status: 200 }
        }
    } catch (error) {
        return { status: 400 }
    }
}

export const onGetActiveSubscription = async (groupId: string) => {
    try {
        const subscription = await client.subscription.findFirst({
            where: {
                groupId: groupId,
                active: true,
            },
        })

        const members = await client.members.findMany({
            where: {
                groupId: groupId,
            },
        })

        const memberIds = members.map((member) => member.userId)

        if (subscription) {
            return { status: 200, subscription, members: memberIds }
        }
    } catch (error) {
        return { status: 404 }
    }
}

export const onGetGroupSubscriptionPaymentIntent = async (groupid: string) => {
    try {
        const price = await client.subscription.findFirst({
            where: {
                groupId: groupid,
                active: true,
            },
            select: {
                price: true,
                Group: {
                    select: {
                        User: {
                            select: {
                                stripeId: true,
                            },
                        },
                    },
                },
            },
        })

        if (price && price.price) {
            const paymentIntent = await stripe.paymentIntents.create({
                currency: "usd",
                amount: price.price * 100,
                automatic_payment_methods: {
                    enabled: true,
                },
            })

            if (paymentIntent) {
                return { secret: paymentIntent.client_secret }
            }
        }
    } catch (error) {
        return { status: 400, message: "Failed to load form" }
    }
}

export const onCreateNewGroupSubscription = async (
    groupid: string,
    price: string,
) => {
    try {
        const subscription = await client.group.update({
            where: {
                id: groupid,
            },
            data: {
                subscription: {
                    create: {
                        price: parseInt(price),
                    },
                },
            },
        })

        if (subscription) {
            return { status: 200, message: "Subscription created" }
        }
    } catch (error) {
        return { status: 400, message: "Oops something went wrong" }
    }
}

export const onActivateSubscription = async (id: string) => {
    try {
        // Check if the subscription exists
        const status = await client.subscription.findUnique({
            where: { id },
            select: { active: true },
        })

        if (!status) {
            return { status: 404, message: "Subscription not found" }
        }

        // If the subscription is already active, return early
        if (status.active) {
            return { status: 200, message: "Plan already active" }
        }

        // Use a transaction to ensure atomicity
        const result = await client.$transaction(async (tx) => {
            // Deactivate the currently active subscription, if any
            const current = await tx.subscription.findFirst({
                where: { active: true },
                select: { id: true },
            })

            if (current?.id) {
                await tx.subscription.update({
                    where: { id: current.id },
                    data: { active: false },
                })
            }

            // Activate the new subscription
            const activateNew = await tx.subscription.update({
                where: { id },
                data: { active: true },
            })

            return activateNew
        })

        // If the transaction was successful
        return {
            status: 200,
            message: "New plan activated",
        }
    } catch (error) {
        console.error("Error activating subscription:", error)
        return { status: 400, message: "Oops, something went wrong" }
    }
}

export const onGetStripeIntegration = async () => {
    try {
        const user = await onAuthenticatedUser()
        const stripeId = await client.user.findUnique({
            where: {
                id: user.id,
            },
            select: {
                stripeId: true,
            },
        })

        if (stripeId) {
            return stripeId.stripeId
        }
    } catch (error) {
        console.error("Error getting stripe integration:", error)
    }
}

export const onGetUserSubscriptions = async (userid: string) => {
    try {
        const memberships = await client.members.findMany({
            where: {
                userId: userid,
            },
            select: {
                groupId: true,
            },
        })

        const subscriptions = await client.subscription.findMany({
            where: {
                groupId: {
                    in: memberships
                        .map((membership) => membership.groupId)
                        .filter(
                            (groupId): groupId is string => groupId !== null,
                        ),
                },
            },
        })

        if (subscriptions) {
            return subscriptions
        }
    } catch (error) {
        console.error("Error getting user subscriptions:", error)
    }
}

export const onCancelSubscription = async (subscriptionId: string) => {
    try {
        const subscription = await client.subscription.delete({
            where: {
                id: subscriptionId,
            },
        })

        if (subscription) {
            return { status: 200, message: "Subscription cancelled" }
        }
    } catch (error) {
        return { status: 400, message: "Failed to cancel subscription" }
    }
}
