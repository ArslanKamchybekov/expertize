"use client"
import { JoinButton } from "@/app/(discover)/about/_components/join-button"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useGroupInfo } from "@/hooks/groups"
import { cn, truncateString } from "@/lib/utils"
import { AlertCircle, Lock } from "lucide-react"
import Image from "next/image"
import { memo } from "react"

interface Props {
    light?: boolean
    groupid?: string
    userid?: string
}

interface GroupError {
    message: string
    retry: () => void
}

const ErrorState = ({ error }: { error: GroupError }) => (
    <div className="space-y-4 p-4">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <p className="text-themeTextGray">{error.message}</p>
        <Button onClick={error.retry}>Retry</Button>
    </div>
)

const LoadingState = () => (
    <div className="space-y-4 p-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
    </div>
)

const GroupSideWidget = memo(({ groupid, light, userid }: Props) => {
    const { group, error, isLoading } = useGroupInfo()

    if (isLoading) return <LoadingState />
    // if (error) return <ErrorState error={error} />
    if (!group) return null

    return (
        <Card
            className={cn(
                "border-themeGray lg:sticky lg:top-0 mt-10 lg:mt-0 rounded-xl overflow-hidden",
                light ? "border-themeGray bg-[#1A1A1D]" : "bg-themeBlack",
            )}
        >
            <div className="relative aspect-video">
                <Image
                    src={`https://ucarecdn.com/${group.thumbnail}/`}
                    alt={`${group.name} thumbnail`}
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => {
                        e.currentTarget.src = "/fallback-image.png"
                    }}
                />
            </div>
            <div className="flex flex-col p-5 gap-y-3">
                <h2 className="font-bold text-lg line-clamp-2">{group.name}</h2>
                <div
                    className="text-sm text-themeTextGray font-bold flex gap-x-1 items-center"
                    role="status"
                    aria-label={`Group privacy: ${group.privacy ? "Private" : "Public"}`}
                >
                    <Lock className="h-5 w-5" aria-hidden="true" />
                    <span>{group.privacy}</span>
                </div>
                {group.description && (
                    <p className="text-sm text-themeTextGray line-clamp-3">
                        {truncateString(group.description)}
                    </p>
                )}
            </div>
            <Separator orientation="horizontal" className="bg-themeGray" />
            {groupid && (
                <JoinButton
                    groupid={groupid}
                    owner={group.userId === userid}
                    userid={userid ?? ""}
                />
            )}
        </Card>
    )
})

GroupSideWidget.displayName = "GroupSideWidget"

export default GroupSideWidget
