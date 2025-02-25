"use client"

import { DropDown } from "@/components/global/drop-down"
import { Button } from "@/components/ui/button"
import { CarotSort } from "@/icons"
import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/utils"

type GroupDropDownProps = {
    members?: {
        Group: {
            channel: {
                id: string
            }[]
            id: string
            name: string
            icon: string | null
        } | null
    }[]
    groups:
        | {
              status: number
              groups: {
                  channel: {
                      id: string
                  }[]
                  id: string
                  name: string
                  icon: string | null
              }[]
          }
        | {
              status: number
              groups?: undefined
          }
}

export const GroupDropDown = ({ groups, members }: GroupDropDownProps) => {
    const { groups: ownedGroups } = groups
    console.log(ownedGroups?.[0]?.icon)

    return (
        <DropDown
            title="Groups"
            trigger={
                <Button
                    variant="ghost"
                    className="rounded-2xl hover:bg-themeGray font-bold flex gap-2"
                >
                    Expertize.
                    <CarotSort />
                </Button>
            }
        >
            {ownedGroups && ownedGroups.length > 0 && (
                <>
                    {ownedGroups.map((item) => (
                        <Link
                            key={item.id}
                            href={`/group/${item.id}/channel/${item.channel[0].id}`}
                        >
                            <Button
                                variant="ghost"
                                className="flex gap-2 w-full justify-start hover:bg-themeGray items-center overflow-scroll"
                            >
                                <Image
                                    src={getImageUrl(item.icon || "")}
                                    alt="group-icon"
                                    width={30}
                                    height={30}
                                    className="rounded-full"
                                />
                                {item.name}
                            </Button>
                        </Link>
                    ))}
                </>
            )}

            {members && members.length > 0 && (
                <>
                    {members.map((member) => (
                        <Link
                            key={member.Group?.id}
                            href={`/group/${member.Group?.id}/channel/${member.Group?.channel[0].id}`}
                        >
                            <Button
                                variant="ghost"
                                className="flex gap-2 w-full justify-start hover:bg-themeGray items-center overflow-scroll"
                            >
                                <Image
                                    src={getImageUrl(member.Group?.icon || "")}
                                    alt="group-icon"
                                    width={30}
                                    height={30}
                                    className="rounded-full"
                                />
                                {member.Group?.name}
                            </Button>
                        </Link>
                    ))}
                </>
            )}

            {groups.status !== 200 && (
                <div className="p-4">
                    <p className="text-sm text-themeGray">No groups found</p>
                </div>
            )}
        </DropDown>
    )
}
