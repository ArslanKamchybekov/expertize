"use client"

import { DropDown } from "@/components/global/drop-down"
import { Button } from "@/components/ui/button"
import { CarotSort } from "@/icons"
import { Group } from "lucide-react"
import Link from "next/link"

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
                    {/* <h4 className="px-4 text-sm font-semibold text-themeTextGray">
                        Owned Groups
                    </h4> */}
                    {ownedGroups.map((item) => (
                        <Link
                            key={item.id}
                            href={`/group/${item.id}/channel/${item.channel[0].id}`}
                        >
                            <Button
                                variant="ghost"
                                className="flex gap-2 w-full justify-start hover:bg-themeGray items-center overflow-scroll"
                            >
                                {item.name}
                            </Button>
                        </Link>
                    ))}
                </>
            )}

            {/* <Separator orientation="horizontal" /> */}

            {members && members.length > 0 && (
                <>
                    {/* <h4 className="px-4 py-2 text-sm font-semibold text-themeTextGray">
                        Member Groups
                    </h4> */}
                    {members.map((member) => (
                        <Link
                            key={member.Group?.id}
                            href={`/group/${member.Group?.id}/channel/${member.Group?.channel[0].id}`}
                        >
                            <Button
                                variant="ghost"
                                className="flex gap-2 w-full justify-start hover:bg-themeGray items-center overflow-scroll"
                            >
                                <Group />
                                {member.Group?.name}
                            </Button>
                        </Link>
                    ))}
                </>
            )}
        </DropDown>
    )
}
