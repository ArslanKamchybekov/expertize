import BackdropGradient from "@/components/global/backdrop-gradient"
import GradientText from "@/components/global/gradient-text"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Check } from "@/icons"
import Link from "next/link"

type Props = {}

export const PricingSection = (props: Props) => {
    return (
        <div
            className="w-full pt-20 flex flex-col items-center gap-3"
            id="pricing"
        >
            <BackdropGradient className="w-8/12 h-full opacity-40 flex flex-col items-center">
                <GradientText
                    className="text-4xl font-semibold text-center"
                    element="H2"
                >
                    Plans That Fit Your Needs
                </GradientText>
            </BackdropGradient>
            <div className="flex flex-col md:flex-row gap-5">
                {/* Starter Plan */}
                <Card className="p-7 mt-10 md:w-auto w-full bg-themeBlack border-themeGray">
                    <div className="flex flex-col gap-2">
                        <CardTitle>STARTER</CardTitle>
                        <CardDescription className="text-[#B4B0AE]">
                            Perfect for individuals and small groups
                        </CardDescription>
                        <p className="text-[#B4B0AE]">
                            <span className="text-2xl font-bold">$10</span> /
                            month
                        </p>
                        <Link href="#" className="w-full mt-3">
                            <Button
                                variant="default"
                                className="bg-[#333337] w-full rounded-2xl text-white hover:text-[#333337]"
                            >
                                Try a 7-day free trial
                            </Button>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2 text-[#B4B0AE] mt-5">
                        <p>Features</p>
                        <span className="flex gap-2 mt-3 items-center">
                            <Check />
                            Real-time chat for groups
                        </span>
                        <span className="flex gap-2 items-center">
                            <Check />
                            Create and join free groups
                        </span>
                        <span className="flex gap-2 items-center">
                            <Check />
                            Post creation, likes, and comments
                        </span>
                        <span className="flex gap-2 items-center">
                            <Check />
                            Basic affiliate marketing tools
                        </span>
                    </div>
                </Card>

                {/* Pro Plan */}
                <Card className="p-7 mt-10 md:w-auto w-full bg-themeBlack border-themeGray">
                    <div className="flex flex-col gap-2">
                        <CardTitle>PRO</CardTitle>
                        <CardDescription className="text-[#B4B0AE]">
                            Designed for growing businesses and power users
                        </CardDescription>
                        <p className="text-[#B4B0AE]">
                            <span className="text-2xl font-bold">$25</span> /
                            month
                        </p>
                        <Link href="#" className="w-full mt-3">
                            <Button
                                variant="default"
                                className="bg-[#333337] w-full rounded-2xl text-white hover:text-[#333337]"
                            >
                                Try a 7-day free trial
                            </Button>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2 text-[#B4B0AE] mt-5">
                        <p>Features</p>
                        <span className="flex gap-2 mt-3 items-center">
                            <Check />
                            Everything in Starter
                        </span>
                        <span className="flex gap-2 items-center">
                            <Check />
                            Host paid groups
                        </span>
                        <span className="flex gap-2 items-center">
                            <Check />
                            Create and host course modules
                        </span>
                        <span className="flex gap-2 items-center">
                            <Check />
                            Custom domain hosting with white-labeling
                        </span>
                        <span className="flex gap-2 items-center">
                            <Check />
                            Advanced affiliate marketing tools
                        </span>
                        <span className="flex gap-2 items-center">
                            <Check />
                            Node-based text editor
                        </span>

                        <span className="flex gap-2 items-center">
                            <Check />
                            Expertize AI capabilities
                        </span>
                    </div>
                </Card>
            </div>
        </div>
    )
}
