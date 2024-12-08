"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGroupMembers } from "@/hooks/groups"
import { useAppSelector } from "@/redux/store"
import { User } from "lucide-react"
import { useRouter } from "next/navigation"

type GroupMembersListProps = {
    groupid: string
}

export const GroupMembersList = ({ groupid }: GroupMembersListProps) => {
    const { members } = useAppSelector((state) => state.onlineTrackingReducer)
    const { data } = useGroupMembers(groupid)
    const router = useRouter()

    const onOpenChat = (memberId: string) => {
        const currentPath = window.location.pathname
        const newPath = `/group/${groupid}/messages/${memberId}`

        if (currentPath !== newPath) {
            router.push(newPath)
        }
    }

    return (
        <div className="flex flex-col">
            {data?.status === 200 &&
                data.members?.map((member) => (
                    <div
                        key={member.id}
                        onClick={() => onOpenChat(member.id)}
                        className="flex gap-x-2 items-center p-5 hover:bg-themeGray cursor-pointer"
                    >
                        <div className="relative">
                            {members.map(
                                (m) =>
                                    m.id === member.userId && (
                                        <span
                                            key={m.id}
                                            className="absolute bottom-0 right-0 z-50 w-2 h-2 rounded-full bg-green-600"
                                        ></span>
                                    ),
                            )}
                            <Avatar>
                                <AvatarImage
                                    src={member.User?.image!}
                                    alt="user"
                                />
                                <AvatarFallback>
                                    <User />
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex flex-col">
                            <h3>{`${member.User?.firstname} ${member.User?.lastname}`}</h3>
                        </div>
                    </div>
                ))}
        </div>
    )
}
