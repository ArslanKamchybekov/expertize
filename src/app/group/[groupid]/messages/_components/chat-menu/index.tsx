"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGroupChat } from "@/hooks/groups"
import { Empty } from "@/icons"
import { useAppSelector } from "@/redux/store"
import { User } from "lucide-react"
import { useRouter } from "next/navigation"

type GroupChatMenuProps = {
    groupid: string
}

export const GroupChatMenu = ({ groupid }: GroupChatMenuProps) => {
    const { members } = useAppSelector((state) => state.onlineTrackingReducer)
    const { data, pathname } = useGroupChat(groupid)
    const router = useRouter()

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

    if (!data?.members) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Empty/>
                <h3 className="mt-4">No members found</h3>
            </div>
        )
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
