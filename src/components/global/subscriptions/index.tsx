"use client"

import { onCancelSubscription } from "@/actions/payments"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertTriangle,
    Calendar,
    CheckCircle2,
    CreditCard,
    Group,
} from "lucide-react"
import { useRouter } from "next/navigation"
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
    const router = useRouter()
    const [currentSubscriptions, setCurrentSubscriptions] =
        useState(subscriptions)

    const handleCancelSubscription = async (subscriptionId: string) => {
        try {
            await onCancelSubscription(subscriptionId)
            setCurrentSubscriptions((prev) =>
                prev.filter((sub) => sub.id !== subscriptionId),
            )
        } catch (error) {
            console.error("Failed to cancel subscription:", error)
        }
    }

    return (
        <section className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentSubscriptions.length > 0 ? (
                    currentSubscriptions.map((subscription) => {
                        const group = groups.find(
                            (g) => g.id === subscription.groupId,
                        )
                        const subscriptionDate = new Date(
                            subscription.createdAt,
                        )
                        const isRecentSubscription =
                            Date.now() - subscription.createdAt <
                            7 * 24 * 60 * 60 * 1000 // 7 days

                        return (
                            <Card
                                key={subscription.id}
                                className="relative overflow-hidden"
                            >
                                {isRecentSubscription && (
                                    <div className="absolute top-0 right-0">
                                        <Badge className="rounded-none rounded-bl bg-green-500/10 text-green-500">
                                            New
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-2xl font-bold">
                                            ${subscription.price}
                                            <span className="text-sm text-muted-foreground ml-1">
                                                /month
                                            </span>
                                        </CardTitle>
                                        <Badge
                                            variant={
                                                subscription.active
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {subscription.active ? (
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                            ) : (
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                            )}
                                            {subscription.active
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Group className="w-4 h-4" />
                                        <span>
                                            {group?.name || "Unknown Group"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            Started{" "}
                                            {subscriptionDate.toLocaleDateString(
                                                "en-US",
                                                {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                },
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CreditCard className="w-4 h-4" />
                                        <span>
                                            Next billing date:{" "}
                                            {new Date(
                                                subscriptionDate.setMonth(
                                                    subscriptionDate.getMonth() +
                                                        1,
                                                ),
                                            ).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </CardContent>

                                <CardFooter>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                            >
                                                Cancel Subscription
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Cancel Subscription
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Are you sure you want to
                                                    cancel your subscription to{" "}
                                                    {group?.name}? This action
                                                    cannot be undone.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() =>
                                                        handleCancelSubscription(
                                                            subscription.id,
                                                        )
                                                    }
                                                >
                                                    Yes, Cancel Subscription
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardFooter>
                            </Card>
                        )
                    })
                ) : (
                    <Card className="col-span-full p-6">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <CreditCard className="w-12 h-12 text-muted-foreground" />
                            <div className="text-center space-y-2">
                                <h3 className="font-semibold">
                                    No Active Subscriptions
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    You do not have any active subscriptions at
                                    the moment.
                                </p>
                            </div>
                            <Button onClick={() => router.push("/")}>
                                Browse Available Plans
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </section>
    )
}
