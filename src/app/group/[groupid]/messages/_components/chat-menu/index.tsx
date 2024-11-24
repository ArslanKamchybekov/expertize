"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGroupChat } from "@/hooks/groups"
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
    
        // Remove '/messages' from the path if it exists, but avoid removing it from the group path
        const basePath = currentPath.includes("/messages") 
            ? currentPath.split("/messages")[0]  // Remove the trailing '/messages' part
            : currentPath
    
        const newPath = `${basePath}/messages/${memberId}`
    
        // Redirect only if the current path doesn't already match the intended path
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
