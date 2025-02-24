"use client"

import InfiniteScrollObserver from "@/components/global/infinite-scroll"
import { Skeleton } from "@/components/ui/skeleton"
import { useChannelPage } from "@/hooks/channels"
import { memo } from "react"
import { PaginatedPosts } from "../paginated-posts"
import { PostCard } from "./post-card"

interface Author {
    firstname: string
    lastname: string
    image: string | null
}

interface Like {
    id: string
    userId: string
}

interface Channel {
    name: string
}

interface Post {
    id: string
    createdAt: Date
    title: string | null
    htmlContent: string | null
    jsonContent: string | null
    content: string
    authorId: string
    channelId: string
    likes: Like[]
    channel: Channel
    _count: {
        likes: number
        comments: number
    }
    author: Author
}

interface PostFeedProps {
    channelid: string
    userid: string
}

const LoadingSkeleton = () => (
    <div className="space-y-4">
        {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-[200px] rounded-lg" />
        ))}
    </div>
)

const PostList = memo(
    ({ posts, userid }: { posts: Post[]; userid: string }) => (
        <>
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    channelname={post.channel.name}
                    title={post.title ?? "Untitled Post"}
                    html={post.htmlContent ?? ""}
                    username={`${post.author.firstname} ${post.author.lastname}`.trim()}
                    userimage={post.author.image ?? "/default-avatar.png"}
                    likes={post._count.likes}
                    comments={post._count.comments}
                    postid={post.id}
                    likedUser={post.likes[0]?.userId}
                    userid={userid}
                    likeid={post.likes[0]?.id}
                />
            ))}
        </>
    ),
)

export const PostFeed = memo(({ channelid, userid }: PostFeedProps) => {
    const { data, error, isLoading } = useChannelPage(channelid)
    const posts = data && "posts" in data ? (data.posts as Post[]) : undefined

    if (isLoading) return <LoadingSkeleton />
    if (error) return <div className="text-red-500">Failed to load posts</div>
    if (!posts?.length)
        return (
            <div className="text-center text-themeTextGray">
                No posts yet ...
            </div>
        )

    return (
        <>
            <PostList posts={posts} userid={userid} />
            <InfiniteScrollObserver
                action="POSTS"
                loading="POST"
                identifier={channelid}
                paginate={posts.length}
            >
                <PaginatedPosts userid={userid} />
            </InfiniteScrollObserver>
        </>
    )
})

PostList.displayName = "PostList"
PostFeed.displayName = "PostFeed"
