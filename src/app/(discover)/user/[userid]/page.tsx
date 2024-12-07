import { onAuthenticatedUser } from "@/actions/auth"
import { onGetUserGroups } from "@/actions/groups"
import { onGetUserSubscriptions } from "@/actions/payments"
import Subscriptions from "@/components/global/subscriptions"
import { redirect } from "next/navigation"

export default async function UserProfilePage() {
    const user = await onAuthenticatedUser()

    if (!user?.id) redirect("/sign-in")

    const userGroups = await onGetUserGroups(user.id)
    const userSubscriptions = await onGetUserSubscriptions(user.id)

    const groups = (userGroups.groups ?? [])
        .filter((group) => group !== null)
        .map((group) => ({
            id: group!.id,
            name: group!.name,
            icon: group!.icon || "",
            userId: group!.userId,
        }))

    const subscriptions = (userSubscriptions ?? []).map((sub) => ({
        id: sub.id,
        price: sub.price ?? 0,
        groupId: sub.groupId ?? "",
        active: sub.active,
        createdAt: sub.createdAt.getTime(),
    }))

    return (
        <>
            <div className="relative flex flex-col items-center text-center gap-6 p-8 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-700 via-transparent to-transparent opacity-30 pointer-events-none rounded-lg"></div>

                <div className="relative flex flex-col items-center gap-4">
                    <div className="relative">
                        <img
                            src={user.image}
                            alt={`${user.username}'s avatar`}
                            className={`w-24 h-24 rounded-full border-4 ${
                                user.status === 200
                                    ? "border-green-500"
                                    : "border-red-500"
                            } shadow-lg object-cover`}
                        />
                        <span
                            className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white ${
                                user.status === 200
                                    ? "bg-green-500"
                                    : "bg-red-500"
                            }`}
                            title={user.status === 200 ? "Active" : "Inactive"}
                        ></span>
                    </div>

                    <h1 className="text-3xl font-bold text-white">
                        {user.username}
                    </h1>
                </div>
            </div>

            <section className="w-full mt-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                    Your Groups
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.length > 0 ? (
                        groups.map((group) => (
                            <div
                                key={group.id}
                                className="py-6 bg-gray-950 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 flex flex-col items-center gap-2"
                            >
                                <img
                                    src={`https://ucarecdn.com/${group.icon}/`}
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

            <Subscriptions subscriptions={subscriptions} groups={groups} />
        </>
    )
}
