"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGroupChat } from "@/hooks/groups"
import { useAppSelector } from "@/redux/store"
import { MessageCircle, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

type GroupChatMenuProps = {
    groupid: string
}

export const GroupChatMenu = ({ groupid }: GroupChatMenuProps) => {
    const { members } = useAppSelector((state) => state.onlineTrackingReducer)
    const { data } = useGroupChat(groupid)
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")

    const onOpenChat = (memberId: string) => {
        const currentPath = window.location.pathname
        const basePath = currentPath.includes("/messages")
            ? currentPath.split("/messages")[0]
            : currentPath
        const newPath = `${basePath}/messages/${memberId}`

        if (currentPath !== newPath) {
            router.push(newPath)
        }
    }

    const filteredMembers = useMemo(() => {
        return data?.members?.filter((member) =>
            `${member.User?.firstname} ${member.User?.lastname}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
        )
    }, [data?.members, searchQuery])

    const onlineMembers = useMemo(
        () =>
            filteredMembers?.filter((member) =>
                members.some((m) => m.id === member.userId),
            ),
        [filteredMembers, members],
    )

    const offlineMembers = useMemo(
        () =>
            filteredMembers?.filter(
                (member) => !members.some((m) => m.id === member.userId),
            ),
        [filteredMembers, members],
    )

    if (!data?.members) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <h3 className="font-semibold">No Members Found</h3>
                <p className="text-sm text-muted-foreground">
                    There are no members in this group chat yet.
                </p>
            </div>
        )
    }

    return (
        <Card className="h-full bg-themeBlack">
            <CardHeader className="space-y-4">
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Chat Members
                        <Badge variant="secondary" className="ml-2">
                            {data.members.length}
                        </Badge>
                    </CardTitle>
                </div>
                <div className="relative">
                    <Input
                        placeholder="Search members..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                    {onlineMembers && onlineMembers.length > 0 && (
                        <div>
                            <div className="px-4">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Online — {onlineMembers.length}
                                </span>
                            </div>
                            {onlineMembers.map((member) => (
                                <MemberItem
                                    key={member.id}
                                    member={member}
                                    isOnline={true}
                                    onClick={() => onOpenChat(member.id)}
                                />
                            ))}
                        </div>
                    )}

                    {offlineMembers && offlineMembers.length > 0 && (
                        <div>
                            <div className="px-4">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Offline — {offlineMembers.length}
                                </span>
                            </div>
                            {offlineMembers.map((member) => (
                                <MemberItem
                                    key={member.id}
                                    member={member}
                                    isOnline={false}
                                    onClick={() => onOpenChat(member.id)}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

interface MemberItemProps {
    member: any
    isOnline: boolean
    onClick: () => void
}

const MemberItem = ({ member, isOnline, onClick }: MemberItemProps) => (
    <div
        onClick={onClick}
        className="flex items-center justify-between px-4 py-2 hover:bg-accent/50 cursor-pointer transition-colors"
    >
        <div className="flex items-center gap-3">
            <div className="relative">
                <Avatar>
                    <AvatarImage
                        src={member.User?.image!}
                        alt={`${member.User?.firstname} ${member.User?.lastname}`}
                    />
                    <AvatarFallback>
                        {member.User?.firstname?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background"></span>
                )}
            </div>
            <div className="flex flex-col">
                <span className="font-medium">
                    {`${member.User?.firstname} ${member.User?.lastname}`}
                </span>
                <span className="text-sm text-muted-foreground">
                    {isOnline ? "Online" : "Offline"}
                </span>
            </div>
        </div>
        <MessageCircle className="w-4 h-4 text-muted-foreground" />
    </div>
)
