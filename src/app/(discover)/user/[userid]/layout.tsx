import { onAuthenticatedUser } from "@/actions/auth"
import { onGetUserGroups } from "@/actions/groups"
import { onGetUserSubscriptions } from "@/actions/payments"
import { redirect } from "next/navigation"
import React from "react"

// In your server layout
const UserProfileLayout = async ({
    children,
}: {
    children: React.ReactNode
}) => {
    const user = await onAuthenticatedUser()

    if (!user?.id) redirect("/sign-in")

    const userGroups = await onGetUserGroups(user.id)
    const userSubscriptions = (await onGetUserSubscriptions(user.id)) || []

    // Create a serializable version of the data
    const serializedData = {
        user: user
            ? {
                  status: user.status || 0,
                  id: user.id || "",
                  username: user.username || "",
                  image: user.image || "",
              }
            : null,
        groups:
            userGroups.groups
                ?.map((group) =>
                    group
                        ? {
                              id: group.id,
                              name: group.name,
                              icon: group.icon || "",
                              userId: group.userId,
                              channel: [],
                          }
                        : null,
                )
                .filter((group) => group !== null) || [],
        subscriptions:
            userSubscriptions?.map((sub) => ({
                id: sub.id,
                price: sub.price,
                groupId: sub.groupId,
                active: sub.active,
                createdAt: sub.createdAt,
            })) || [],
    }

    console.log("Serialized Data:", serializedData)

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-12">
            <div className="w-full max-w-4xl p-8 bg-themeBlack rounded-lg shadow-lg">
                {React.Children.map(children, (child) =>
                    React.isValidElement(child)
                        ? React.cloneElement(child, serializedData)
                        : child,
                )}
            </div>
        </div>
    )
}

export default UserProfileLayout
