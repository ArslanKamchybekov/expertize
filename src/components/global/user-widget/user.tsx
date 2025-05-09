"use client"

import { onDeleteUser } from "@/actions/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { useSideBar } from "@/hooks/navigation"
import { Logout } from "@/icons"
import { supabaseClient } from "@/lib/utils"
import { onOffline } from "@/redux/slices/online-member-slice"
import { AppDispatch } from "@/redux/store"
import { useClerk } from "@clerk/nextjs"
import { Settings, Trash, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { DropDown } from "../drop-down"

type UserWidgetProps = {
    image: string
    groupid?: string
    userid?: string
}

export const UserAvatar = ({ image, groupid, userid }: UserWidgetProps) => {
    const { signOut } = useClerk()
    const dispatch: AppDispatch = useDispatch()

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const deleteAccount = async () => {
        if (!userid) return
        onDeleteUser(userid)
        signOut({ redirectUrl: "/" })
    }

    const { groupInfo } = useSideBar(groupid!)

    const untrackPresence = async () => {
        await supabaseClient.channel("tracking").untrack()
    }

    const onLogout = async () => {
        untrackPresence()
        dispatch(onOffline({ members: [{ id: userid! }] }))
        signOut({ redirectUrl: "/" })
    }

    return (
        <>
            <DropDown
                title="Account"
                trigger={
                    <Avatar className="cursor-pointer">
                        <AvatarImage src={image} alt="user" />
                        <AvatarFallback>{""}</AvatarFallback>
                    </Avatar>
                }
            >
                <Link href={`/user/${userid}`}>
                    <Button
                        variant="ghost"
                        className="flex gap-x-2 px-2 w-full justify-start"
                    >
                        <User size={16} />
                        Profile
                    </Button>
                </Link>
                {groupid && userid === groupInfo?.group?.userId && (
                    <Link href={`/group/${groupid}/settings`}>
                        <Button
                            variant="ghost"
                            className="flex gap-x-2 px-2 w-full justify-start"
                        >
                            <Settings size={16} />
                            Group Settings
                        </Button>
                    </Link>
                )}
                <Button
                    variant="ghost"
                    className="flex gap-x-2 px-2 justify-start w-full"
                    onClick={onLogout}
                >
                    <Logout />
                    Logout
                </Button>
                {/* <Button
                    variant="ghost"
                    className="flex gap-x-2 px-2 justify-start w-full text-red-500"
                    onClick={() => setIsDeleteModalOpen(true)}
                >
                    <Trash size={16} color="red" />
                    Delete Account
                </Button> */}
            </DropDown>

            <Modal
                isOpen={isDeleteModalOpen}
                title="Delete Account"
                description="Are you sure you want to delete your account?"
                onConfirm={() => {
                    deleteAccount()
                    setIsDeleteModalOpen(false)
                }}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </>
    )
}
