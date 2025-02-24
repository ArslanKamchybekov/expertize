"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGroupMembers } from "@/hooks/groups"
import { useAppSelector } from "@/redux/store"
import { MessageCircle, MoreHorizontal, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

type GroupMembersListProps = {
    groupid: string
}

export const GroupMembersList = ({ groupid }: GroupMembersListProps) => {
    const { members } = useAppSelector((state) => state.onlineTrackingReducer)
    const { data } = useGroupMembers(groupid)
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")

    const onOpenChat = (memberId: string) => {
        const currentPath = window.location.pathname
        const newPath = `/group/${groupid}/messages/${memberId}`

        if (currentPath !== newPath) {
            router.push(newPath)
        }
    }

    const filteredMembers = data?.members?.filter((member) =>
        `${member.User?.firstname} ${member.User?.lastname}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
    )

    const isOnline = (userId: string) => members.some((m) => m.id === userId)

    return (
        <Card className="h-full bg-inherit">
            <CardHeader className="space-y-4">
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Group Members
                        <Badge variant="secondary" className="ml-2">
                            {data?.members?.length || 0}
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
                <ScrollArea className="h-[500px] w-full">
                    <div className="flex flex-col">
                        {filteredMembers?.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                            >
                                <div
                                    className="flex items-center gap-3 cursor-pointer flex-1"
                                    onClick={() => onOpenChat(member.id)}
                                >
                                    <div className="relative">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage
                                                src={member.User?.image!}
                                                alt={`${member.User?.firstname} ${member.User?.lastname}`}
                                            />
                                            <AvatarFallback>
                                                {member.User?.firstname[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        {isOnline(member.id) && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background"></span>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {`${member.User?.firstname} ${member.User?.lastname}`}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {isOnline(member.id)
                                                ? "Online"
                                                : "Offline"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onOpenChat(member.id)}
                                        className="p-2 hover:bg-accent rounded-full"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                    </button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="p-2 hover:bg-accent rounded-full">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    onOpenChat(member.id)
                                                }
                                            >
                                                Send Message
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                View Profile
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
