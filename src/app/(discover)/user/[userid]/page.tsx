import { onAuthenticatedUser } from "@/actions/auth"
import { onGetUserGroups } from "@/actions/groups"
import { onGetUserSubscriptions } from "@/actions/payments"
import Groups from "@/components/global/groups"
import Subscriptions from "@/components/global/subscriptions"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { currentUser } from '@clerk/nextjs/server'
import { CreditCardIcon, MailIcon, User } from "lucide-react"
import { redirect } from "next/navigation"

export default async function UserProfilePage() {
    const user = await currentUser()
    const userInfo = await onAuthenticatedUser()

    if (!user || !userInfo.id) redirect("/sign-in")

    const userGroups = await onGetUserGroups(userInfo.id)
    const userSubscriptions = await onGetUserSubscriptions(userInfo.id)

    const groups = (userGroups.groups ?? [])
        .filter((group) => group !== null)
        .map((group) => ({
            id: group!.id,
            name: group!.name,
            icon: group!.icon || "",
            userId: group!.userId,
        }))

    const subscriptions = (userSubscriptions ?? []).map((sub) => ({
        id: sub.id,
        price: sub.price ?? 0,
        groupId: sub.groupId ?? "",
        active: sub.active,
        createdAt: sub.createdAt.getTime(),
    }))

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Card className="border-none shadow-lg">
                <CardContent className="p-0">
                    {/* Hero Banner */}
                    <div className="relative h-48 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-t-lg">
                        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>

                    {/* Profile Info */}
                    <div className="relative px-6 pb-6">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                            <div className="flex items-end -mt-12 mb-4 md:mb-0">
                                <div className="relative">
                                    <img
                                        src={user.imageUrl}
                                        alt={`${user.username}'s avatar`}
                                        className="w-16 h-16 rounded-full border-4 border-background shadow-xl object-cover"
                                    />
                                    <span
                                        className={`absolute bottom-2 right-1 w-3 h-3 rounded-full border-2 border-background ${
                                            user.banned === true ? "bg-red-500" : "bg-green-500"
                                        }`}
                                    />
                                </div>
                                <div className="ml-4">
                                    <h1 className="text-2xl font-bold">{user.fullName}</h1>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MailIcon className="w-4 h-4" />
                                        <span>{user.emailAddresses[0].emailAddress}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="gap-1">
                                    <User className="w-4 h-4" />
                                    {groups.length} Groups
                                </Badge>
                                <Badge variant="secondary" className="gap-1">
                                    <CreditCardIcon className="w-4 h-4" />
                                    {subscriptions.filter(s => s.active).length} Active Subs
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="groups" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="groups">Groups</TabsTrigger>
                    <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                </TabsList>
                <TabsContent value="groups">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Groups</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Groups groups={groups} currentUserId={user.id} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="subscriptions">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Subscriptions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Subscriptions subscriptions={subscriptions} groups={groups} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
