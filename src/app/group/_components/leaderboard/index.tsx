"use client"

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Crown, Medal, Trophy } from "lucide-react"
import { useState } from "react"

type LeaderBoardUser = {
    id: string
    name: string
    points: number
    avatar: string
    rank: number
}

type LeaderBoardCardProps = {
    light?: boolean
    className?: string
}

const RankIcon = ({ rank }: { rank: number }) => {
    const icons = {
        1: { icon: Crown, color: "text-yellow-400" },
        2: { icon: Trophy, color: "text-gray-400" },
        3: { icon: Medal, color: "text-amber-700" },
    }

    const IconComponent = icons[rank as keyof typeof icons]?.icon

    if (!IconComponent) {
        return <span className="w-5 h-5 flex items-center justify-center">{rank}</span>
    }

    return <IconComponent className={cn("w-5 h-5", icons[rank as keyof typeof icons]?.color)} />
}

const UserRankCard = ({ user }: { user: LeaderBoardUser }) => {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/20 transition-colors">
            <div className="flex items-center justify-center w-8">
                <RankIcon rank={user.rank} />
            </div>
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
            </div>
            <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-yellow-400">{user.points}</span>
                <span className="text-xs text-themeTextGray">pts</span>
            </div>
        </div>
    )
}

const LoadingSkeleton = () => (
    <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="flex-1 h-4" />
                <Skeleton className="w-12 h-4" />
            </div>
        ))}
    </div>
)

const TimeFilter = ({ 
    active, 
    onChange 
}: { 
    active: string,
    onChange: (filter: string) => void 
}) => {
    const filters = ["Daily", "Weekly", "Monthly", "All Time"]
    
    return (
        <div className="flex gap-2 mb-4">
            {filters.map((filter) => (
                <button
                    key={filter}
                    onClick={() => onChange(filter)}
                    className={cn(
                        "px-3 py-1 text-xs rounded-full transition-colors",
                        active === filter
                            ? "bg-themeTextGray text-black"
                            : "text-themeTextGray hover:bg-white/10"
                    )}
                >
                    {filter}
                </button>
            ))}
        </div>
    )
}

export const LeaderBoardCard = ({ light, className }: LeaderBoardCardProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [timeFilter, setTimeFilter] = useState("Weekly")
    
    // Mock data - replace with actual data fetching
    const users: LeaderBoardUser[] = [
        { id: '1', name: 'Sarah Connor', points: 1250, avatar: '/api/placeholder/32/32', rank: 1 },
        { id: '2', name: 'John Smith', points: 980, avatar: '/api/placeholder/32/32', rank: 2 },
        { id: '3', name: 'Alex Johnson', points: 875, avatar: '/api/placeholder/32/32', rank: 3 },
        { id: '4', name: 'Maria Garcia', points: 750, avatar: '/api/placeholder/32/32', rank: 4 },
        { id: '5', name: 'James Wilson', points: 680, avatar: '/api/placeholder/32/32', rank: 5 },
        { id: '6', name: 'Emma Davis', points: 590, avatar: '/api/placeholder/32/32', rank: 6 },
        { id: '7', name: 'Michael Brown', points: 520, avatar: '/api/placeholder/32/32', rank: 7 },
        { id: '8', name: 'Lisa Anderson', points: 470, avatar: '/api/placeholder/32/32', rank: 8 },
    ]

    const handleTimeFilterChange = (filter: string) => {
        setIsLoading(true)
        setTimeFilter(filter)
        // Simulate data loading
        setTimeout(() => setIsLoading(false), 500)
    }

    return (
        <Card
            className={cn(
                "border-themeGray lg:top-0 lg:sticky lg:mt-0 rounded-xl overflow-hidden",
                light ? "border-themeGray bg-[#1A1A1D]" : "bg-themeBlack",
                className
            )}
        >
            <div className="p-5">
                <h2 className="text-themeTextWhite text-xl font-bold mb-4">
                    Leaderboard
                </h2>
                
                <TimeFilter 
                    active={timeFilter} 
                    onChange={handleTimeFilterChange} 
                />

                <ScrollArea className="h-[400px] -mx-2 px-2">
                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : (
                        <div className="space-y-1">
                            {users.map((user) => (
                                <UserRankCard key={user.id} user={user} />
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>
        </Card>
    )
}