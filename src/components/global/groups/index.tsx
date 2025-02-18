"use client"

import { onLeaveGroup } from "@/actions/groups"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Crown, Plus, UserMinus, Users } from "lucide-react"
import { useRouter } from "next/navigation"
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
    const router = useRouter()

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
        <section className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userGroups.length > 0 ? (
                    <>
                        {userGroups.map((group) => (
                            <Card
                                key={group.id}
                                className="relative group hover:shadow-lg transition-all duration-200"
                            >
                                <CardHeader className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 p-1">
                                                <img
                                                    src={`https://ucarecdn.com/${group.icon}/`}
                                                    alt={`${group.name} icon`}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            </div>
                                            {group.userId === currentUserId && (
                                                <Badge
                                                    variant="secondary"
                                                    className="absolute -bottom-1 -right-1"
                                                >
                                                    <Crown className="w-3 h-3 mr-1 text-yellow-500" />
                                                    Owner
                                                </Badge>
                                            )}
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="opacity-0 group-hover:opacity-100"
                                                >
                                                    <Users className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {group.userId !==
                                                    currentUserId && (
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleLeaveGroup(
                                                                group.id,
                                                            )
                                                        }
                                                        disabled={
                                                            leavingGroupId ===
                                                            group.id
                                                        }
                                                        className="text-red-500 focus:text-red-500"
                                                    >
                                                        <UserMinus className="w-4 h-4 mr-2" />
                                                        {leavingGroupId ===
                                                        group.id
                                                            ? "Leaving..."
                                                            : "Leave Group"}
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-lg tracking-tight">
                                            {group.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                          You&apos;re a member
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {/* Additional group information could go here */}
                                </CardContent>
                                <CardFooter className="justify-between">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            router.push(`/about/${group.id}`)
                                        }
                                    >
                                        View Details
                                    </Button>
                                    {group.userId === currentUserId && (
                                        <Button variant="secondary" size="sm">
                                            Manage
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                        {/* Add New Group Card */}
                        <Card className="flex flex-col items-center justify-center p-6 border-dashed">
                            <Button
                                variant="ghost"
                                size="lg"
                                className="w-full h-full"
                                onClick={() => router.push("/group/create")}
                            >
                                <Plus className="w-6 h-6 mr-2" />
                                Create New Group
                            </Button>
                        </Card>
                    </>
                ) : (
                    <Card className="col-span-full p-6">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <Users className="w-12 h-12 text-muted-foreground" />
                            <div className="text-center space-y-2">
                                <h3 className="font-semibold">No Groups Yet</h3>
                                <p className="text-sm text-muted-foreground">
                                    You have not joined any groups yet. Create
                                    or join a group to get started.
                                </p>
                            </div>
                            <Button
                                onClick={() => router.push("/group/create")}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Your First Group
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </section>
    )
}

export default Groups
