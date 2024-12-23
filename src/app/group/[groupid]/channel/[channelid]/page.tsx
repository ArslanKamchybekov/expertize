import { onAuthenticatedUser } from "@/actions/auth"
import { onGetChannelInfo } from "@/actions/channels"
import { onGetGroupInfo } from "@/actions/groups"
import { LeaderBoardCard } from "@/app/group/_components/leaderboard"
import GroupSideWidget from "@/components/global/group-side-widget"
import { Skeleton } from "@/components/ui/skeleton"
import { currentUser } from "@clerk/nextjs/server"
import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from "@tanstack/react-query"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import Menu from "../../_components/group-navbar"
import CreateNewPost from "./_components/create-post"
import { PostFeed } from "./_components/post-feed"

type Props = {
    params: { channelid: string; groupid: string }
}

// Loading skeleton for the main content
const LoadingSkeleton = () => (
    <div className="grid lg:grid-cols-4 grid-cols-1 w-full flex-1 h-0 gap-x-5 px-5">
        <div className="col-span-1 lg:inline relative hidden py-5">
            <Skeleton className="h-[500px] w-full" />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-y-5 py-5">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-40 w-full" />
                ))}
            </div>
        </div>
        <div className="col-span-1 hidden lg:inline relative py-5">
            <Skeleton className="h-[500px] w-full" />
        </div>
    </div>
)

// Mobile navigation component
const MobileNavigation = ({ groupid }: { groupid: string }) => (
    <div className="lg:hidden sticky top-0 z-10 bg-themeBackground border-b border-themeGray">
        <Menu orientation="mobile" groupid={groupid} />
    </div>
)

const GroupChannelPage = async ({ params }: Props) => {
    try {
        const client = new QueryClient()

        // Fetch user data
        const user = await currentUser()
        if (!user) {
            redirect("/sign-in")
        }

        const authUser = await onAuthenticatedUser()
        if (!authUser?.id) {
            throw new Error("Failed to authenticate user")
        }

        // Prefetch queries
        await Promise.all([
            client.prefetchQuery({
                queryKey: ["channel-info"],
                queryFn: () => onGetChannelInfo(params.channelid),
            }),
            client.prefetchQuery({
                queryKey: ["about-group-info"],
                queryFn: () => onGetGroupInfo(params.groupid),
            }),
        ])

        return (
            <Suspense fallback={<LoadingSkeleton />}>
                <HydrationBoundary state={dehydrate(client)}>
                    <div className="min-h-screen flex flex-col">
                        <MobileNavigation groupid={params.groupid} />

                        <div className="grid lg:grid-cols-4 grid-cols-1 w-full flex-1 gap-x-5 px-5 relative">
                            {/* Left Sidebar */}
                            <aside className="col-span-1 lg:inline hidden py-5 sticky top-5">
                                <LeaderBoardCard light />
                            </aside>

                            {/* Main Content */}
                            <main className="lg:col-span-2 flex flex-col gap-y-5 py-5">
                                <div className="hidden lg:block">
                                    <Menu
                                        orientation="desktop"
                                        groupid={params.groupid}
                                    />
                                </div>

                                <CreateNewPost
                                    userImage={user.imageUrl}
                                    channelid={params.channelid}
                                    username={user.firstName || "User"}
                                />

                                <PostFeed
                                    channelid={params.channelid}
                                    userid={authUser.id}
                                />
                            </main>

                            {/* Right Sidebar */}
                            <aside className="col-span-1 hidden lg:inline py-5 sticky top-5">
                                <GroupSideWidget
                                    light
                                    groupid={params.groupid}
                                    userid={authUser.id}
                                />
                            </aside>
                        </div>
                    </div>
                </HydrationBoundary>
            </Suspense>
        )
    } catch (error) {
        console.error("Error in GroupChannelPage:", error)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">
                        Failed to load channel
                    </h2>
                    <p className="text-themeTextGray">Please try again later</p>
                </div>
            </div>
        )
    }
}

export default GroupChannelPage
