"use client"

import { onLeaveGroup } from "@/actions/groups"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type GroupsProps = {
    groups: {
        id: string
        name: string
        icon: string
        userId: string
    }[]
    currentUserId: string
}

const Groups = ({ groups, currentUserId }: GroupsProps) => {
    const [leavingGroupId, setLeavingGroupId] = useState<string | null>(null)
    const [userGroups, setUserGroups] = useState(groups)

    const handleLeaveGroup = async (groupId: string) => {
        setLeavingGroupId(groupId)
        try {
            const response = await onLeaveGroup(groupId)
            if (response && response.status === 200) {
                setUserGroups((prev) =>
                    prev.filter((group) => group.id !== groupId),
                )
            } else {
                console.error("Failed to leave group")
            }
        } catch (error) {
            console.error("Error leaving group:", error)
        } finally {
            setLeavingGroupId(null)
        }
    }

    return (
        <section className="w-full mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">Your Groups</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userGroups.length > 0 ? (
                    userGroups.map((group) => (
                        <div
                            key={group.id}
                            className="relative bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 p-4 flex flex-col items-center text-center gap-2"
                        >
                            {/* Group Icon */}
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center shadow-inner">
                                <img
                                    src={`https://ucarecdn.com/${group.icon}/`}
                                    alt="Group Icon"
                                    className="w-12 h-12 rounded-full"
                                />
                            </div>

                            {/* Group Role */}
                            <p className="text-sm text-gray-400">
                                {group.userId === currentUserId
                                    ? "Owner"
                                    : "Member"}
                            </p>

                            {/* Group Name */}
                            <h3 className="text-lg font-semibold text-white">
                                {group.name}
                            </h3>

                            {/* Leave Group Button */}
                            {group.userId !== currentUserId && (
                                <Button
                                    onClick={() => handleLeaveGroup(group.id)}
                                    disabled={leavingGroupId === group.id}
                                    variant="outline"
                                    className="w-full"
                                >
                                    {leavingGroupId === group.id
                                        ? "Leaving..."
                                        : "Leave Group"}
                                </Button>
                            )}
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
    )
}

export default Groups
