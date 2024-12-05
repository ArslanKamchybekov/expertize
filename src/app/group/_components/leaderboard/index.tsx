import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type LeaderBoardCardProps = {
    light?: boolean
}

export const LeaderBoardCard = ({ light }: LeaderBoardCardProps) => {
    return (
        <Card
            className={cn(
                "border-themeGray lg:top-0 lg:sticky lg:mt-0 rounded-xl p-5 overflow-hidden",
                light ? "border-themeGray bg-[#1A1A1D]" : "bg-themeBlack",
            )}
        >
            <h2 className="text-themeTextWhite text-xl font-bold">
                Leaderboard
            </h2>
        </Card>
    )
}
