import { onAuthenticatedUser } from "@/actions/auth"
import { onGetUserGroups } from "@/actions/groups"
import { onGetUserSubscriptions } from "@/actions/payments"
import GradientText from "@/components/global/gradient-text"
import { redirect } from "next/navigation"
import React from "react"

const UserProfileLayout = async ({
    children,
}: {
    children: React.ReactNode
}) => {
    // Fetch authenticated user
    const user = await onAuthenticatedUser()
    if (!user?.id) redirect("/sign-in")

    // Fetch user groups server-side
    const userGroups = await onGetUserGroups(user.id)
    console.log(userGroups)
    // Fetch user subscriptions server-side
    const userSubscriptions = (await onGetUserSubscriptions(user.id)) || []

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-12">
            <div className="w-full max-w-4xl p-8 bg-themeBlack rounded-lg shadow-lg">
                {/* Profile Section */}
                <div className="flex flex-col items-center text-center gap-4">
                    <img
                        src={user.image || "/default-avatar.png"}
                        alt={`${user.username}'s avatar`}
                        className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover shadow-lg"
                    />
                    <div>
                        <GradientText className="text-4xl font-extrabold">
                            {user.username}
                        </GradientText>
                    </div>
                </div>

                {/* Groups Section */}
                <section className="w-full mt-10">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        Your Groups
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userGroups.groups && userGroups.groups.length > 0 ? (
                            userGroups.groups.map((group) => (
                                <div
                                    key={group?.id}
                                    className="p-6 bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 flex flex-col items-center gap-4"
                                >
                                    <img
                                        src={`https://ucarecdn.com/${group?.icon as string}/`}
                                        alt="icon"
                                        className="w-10 h-10 rounded-lg"
                                    />
                                    {group?.userId === user.id ? (
                                        <p className="text-gray-400">Owner</p>
                                    ) : (
                                        <p className="text-gray-400">Member</p>
                                    )}
                                    <h3 className="text-xl font-semibold text-white">
                                        {group?.name}
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
                        {userSubscriptions?.length > 0 ? (
                            userSubscriptions.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="p-6 bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
                                >
                                    <h3 className="text-xl font-semibold text-white">
                                        ${sub.price} / month
                                    </h3>
                                    <p className="text-gray-400 mt-2">
                                        {
                                            userGroups.groups?.find(
                                                (group) =>
                                                    group?.id === sub.groupId,
                                            )?.name
                                        }
                                    </p>
                                    <p className="text-gray-400 mt-2">
                                        {sub.active ? "Active" : "Inactive"}
                                    </p>
                                    <p className="text-gray-400 mt-2">
                                        Date:{" "}
                                        {sub.createdAt.toLocaleDateString()}
                                    </p>
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

                {/* Children Content */}
                <div className="mt-12">{children}</div>
            </div>
        </div>
    )
}

export default UserProfileLayout
