import { onAuthenticatedUser } from "@/actions/auth"
import { onGetAllUserMessages, onGetUserFromMembership } from "@/actions/groups"
import { HuddlesForm } from "@/components/forms/huddles"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from "@tanstack/react-query"
import { ArrowLeft, MessageSquare } from "lucide-react"
import { ChatWindow } from "../_components/chat"

const MemberChatPage = async ({ params }: { params: { chatid: string } }) => {
    const query = new QueryClient()
    const member = await onGetUserFromMembership(params.chatid)
    const user = await onAuthenticatedUser()

    await query.prefetchQuery({
        queryKey: ["user-messages"],
        queryFn: () => onGetAllUserMessages(params.chatid),
    })

    if (!member?.member?.User) {
        return (
            <Card className="h-full flex items-center justify-center">
                <CardContent>
                    <div className="text-center space-y-4">
                        <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground" />
                        <h3 className="text-lg font-semibold">
                            Chat Not Available
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            This chat is no longer available or the user has
                            been removed.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const firstName = member.member.User.firstname
    const lastName = member.member.User.lastname
    const userImage = member.member.User.image

    return (
        <HydrationBoundary state={dehydrate(query)}>
            <div className="flex flex-col h-[calc(100vh-4rem)]">
                <Card className="rounded-none border-x-0 border-t-0 bg-inherit">
                    <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={userImage || ""}
                                            alt={`${firstName} ${lastName}`}
                                        />
                                        <AvatarFallback>
                                            {firstName?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="font-semibold capitalize text-lg">
                                        {firstName} {lastName}
                                    </h3>
                                    <span className="text-sm text-muted-foreground">
                                        Online
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <ChatWindow
                    userid={user.id!}
                    recieverid={member.member.User.id!}
                />

                <HuddlesForm recieverid={member.member.User.id!} />
            </div>
        </HydrationBoundary>
    )
}

export default MemberChatPage
