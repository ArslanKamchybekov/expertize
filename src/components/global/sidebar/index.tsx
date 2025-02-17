"use client"
import { Button } from "@/components/ui/button"
import { useGroupChatOnline } from "@/hooks/groups"
import { useSideBar } from "@/hooks/navigation"
import { CarotSort } from "@/icons"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { memo, useMemo } from "react"
import { v4 } from "uuid"
import { DropDown } from "../drop-down"
import SideBarMenu from "./menu"

export interface IChannels {
    id: string
    name: string
    icon: string
    createdAt: Date
    groupId: string | null
}

export interface IGroupInfo {
    status: number
    group: {
        id: string
        name: string
        category: string
        thumbnail: string | null
        description: string | null
        gallery: string[]
        jsonDescription: string | null
        htmlDescription: string | null
        privacy: boolean
        active: boolean
        createdAt: Date
        userId: string
        icon: string
    } | undefined
}

export interface IGroups {
    status: number
    groups:
        | Array<{
              icon: string | null
              id: string
              name: string
          }>
        | undefined
}

interface Props {
    groupid: string
    userid: string
    mobile?: boolean
}

interface Group {
    id: string
    name: string
    category: string
    thumbnail: string | null
    description: string | null
    gallery: string[]
    jsonDescription: string | null
    htmlDescription: string | null
    privacy: boolean
    active: boolean
    createdAt: Date
    userId: string
    icon: string
}

interface GroupInfo {
    status: number
    group: Group | undefined
}

interface Channel {
    id: string
    name: string
    icon: string
    createdAt: Date
    groupId: string | null
}

interface Groups {
    status: number
    groups:
        | Array<{
              icon: string | null
              id: string
              name: string
          }>
        | undefined
}

const getImageUrl = (icon: string) => `https://ucarecdn.com/${icon}/`

// eslint-disable-next-line react/display-name
const GroupsList = memo(
    ({
        groups,
        channels,
    }: {
        groups: Groups["groups"]
        channels: Channel[] | undefined
    }) =>
        groups?.map((item) => (
            <Link
                key={item.id}
                href={`/group/${item.id}/channel/${channels?.[0]?.id}`}
            >
                <Button
                    variant="ghost"
                    className="flex gap-2 w-full justify-start hover:bg-themeGray items-center overflow-scroll"
                    aria-label={`Join ${item.name} group`}
                >
                    {item.name}
                </Button>
            </Link>
        )),
)

const SideBar = ({ groupid, userid, mobile }: Props) => {
    const { groupInfo, groups, mutate, variables, isPending, channels } =
        useSideBar(groupid)
    useGroupChatOnline(userid)

    const isGroupOwner = userid === groupInfo.group?.userId
    const hasGroups = groups?.groups && groups.groups.length > 0

    const handleAddChannel = () => {
        if (isPending) return
        mutate({
            id: v4(),
            icon: "general",
            name: "unnamed",
            createdAt: new Date(),
            groupId: groupid,
        })
    }

    const groupImage = useMemo(
        () => (
            <Image
                src={getImageUrl(groupInfo.group?.icon || "")}
                alt={`${groupInfo.group?.name || "Group"} icon`}
                width={32}
                height={32}
                className="rounded-lg"
                onError={(e) => {
                    e.currentTarget.src = "/fallback-image.png"
                }}
            />
        ),
        [groupInfo.group?.icon, groupInfo.group?.name],
    )

    return (
        <aside
            className={cn(
                "h-screen flex-col gap-y-10 sm:px-5",
                !mobile
                    ? "hidden bg-black md:w-[300px] fixed md:flex"
                    : "w-full flex",
            )}
            role="complementary"
            aria-label="Sidebar navigation"
        >
            {hasGroups && (
                <DropDown
                    title="Groups"
                    trigger={
                        <div className="w-full flex items-center justify-between text-themeTextWhite md:border-[1px] border-themeGray p-3 rounded-xl">
                            <div className="flex gap-x-3 items-center">
                                {groupImage}
                                <p className="text-sm overflow-scroll">
                                    {groupInfo.group?.name || "Unnamed Group"}
                                </p>
                            </div>
                            <span aria-hidden="true">
                                <CarotSort />
                            </span>
                        </div>
                    }
                >
                    <GroupsList
                        groups={groups?.groups}
                        channels={channels?.channels}
                    />
                </DropDown>
            )}

            <div className="flex flex-col gap-y-5">
                <div className="flex justify-between items-center">
                    <p className="text-xs text-[#F7ECE9] font-bold">CHANNELS</p>
                    {isGroupOwner && (
                        <button
                            onClick={handleAddChannel}
                            disabled={isPending}
                            aria-label="Add new channel"
                            className={cn(
                                "text-themeTextGray cursor-pointer",
                                isPending && "opacity-70",
                            )}
                        >
                            <Plus size={16} />
                        </button>
                    )}
                </div>
                <SideBarMenu
                    channels={channels?.channels ?? []}
                    optimisticChannel={variables}
                    loading={isPending}
                    groupid={groupid}
                    groupUserId={groupInfo.group?.userId ?? ""}
                    userId={userid}
                />
            </div>
        </aside>
    )
}

export default memo(SideBar)
