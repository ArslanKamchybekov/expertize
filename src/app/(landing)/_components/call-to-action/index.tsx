import GradientText from "@/components/global/gradient-text"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const CallToAction = () => {
    return (
        <div className="flex flex-col items-center text-center gap-y-5 px-4 md:px-0">
            <GradientText
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight font-semibold"
                element="H1"
            >
                Invest in your future
            </GradientText>
            <p className="text-sm sm:text-base text-muted-foreground my-4 max-w-2xl">
                Expertize is a vibrant online education platform that empowers
                people to connect, collaborate, and cultivate meaningful
                relationships to drive personal and professional growth.
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-center gap-4 w-full sm:w-auto">
                <Link href="">
                    <Button
                        variant="outline"
                        className="rounded-xl bg-transparent text-base w-full sm:w-auto"
                    >
                        Watch Demo
                    </Button>
                </Link>
                <Link href="/sign-in">
                    <Button className="rounded-xl text-base w-full sm:w-auto">
                        Get Started
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default CallToAction
