"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Logout, PersonalDevelopment, Settings } from "@/icons"
import { supabaseClient } from "@/lib/utils"
import { onOffline } from "@/redux/slices/online-member-slice"
import { AppDispatch } from "@/redux/store"
import { useClerk } from "@clerk/nextjs"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { DropDown } from "../drop-down"

type UserWidgetProps = {
    image: string
    groupid?: string
    userid?: string
}

export const UserAvatar = ({ image, groupid, userid }: UserWidgetProps) => {
    const { signOut } = useClerk()

    const untrackPresence = async () => {
        await supabaseClient.channel("tracking").untrack()
    }

    const dispatch: AppDispatch = useDispatch()

    const onLogout = async () => {
        untrackPresence()
        dispatch(onOffline({ members: [{ id: userid! }] }))
        signOut({ redirectUrl: "/" })
    }

    return (
        // if groupid is not passed, don't render settings

        <DropDown
            title="Account"
            trigger={
                <Avatar className="cursor-pointer">
                    <AvatarImage src={image} alt="user" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            }
        >
            <Link href={`/user/${userid}`}>
                <Button
                    variant="ghost"
                    className="flex gap-x-2 px-2 w-full justify-start"
                >
                    <PersonalDevelopment />
                    Profile
                </Button>
            </Link>
            {groupid && (
                <Link href={`/group/${groupid}/settings`}>
                    <Button
                        variant="ghost"
                        className="flex gap-x-2 px-2 w-full justify-start"
                    >
                        <Settings />
                        Settings
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
        </DropDown>
    )
}
