import GradientText from "@/components/global/gradient-text"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Props = {}

const CallToAction = (props: Props) => {
    return (
        <div className="flex flex-col items-start md:items-center gap-y-5 md:gap-y-0">
            <GradientText
                className="text-[35px] md:text-[40px] lg:text-[55px] xl:text-[70px] 2xl:text-[80px] leading-tight font-semibold"
                element="H1"
            >
                Invest in your future
            </GradientText>
            <p className="text-sm md:text-center text-left text-muted-foreground my-4">
                Expertize is a vibrant online education platform that
                empowers <br className="md:hidden" />
                people to connect, <br className="hidden md:block" />{" "}
                collaborate, and cultivate meaningful{" "}
                <br className="md:hidden" />
                relationships to drive personal and professional growth
            </p>
            <div className="flex md:flex-row flex-col md:justify-center gap-5 md:mt-5 w-full">
                <Link href="">
                    <Button
                        variant="outline"
                        className="rounded-xl bg-transparent text-base"
                    >
                        Watch Demo
                    </Button>
                </Link>
                <Link href="/sign-in">
                    <Button className="rounded-xl text-base">
                        Get Started
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default CallToAction
