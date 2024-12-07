import BackdropGradient from "@/components/global/backdrop-gradient"
import GlassCard from "@/components/global/glass-card"
import GradientText from "@/components/global/gradient-text"
import { GH_CONSTANTS } from "@/constants"
import Link from "next/link"

type Props = {
    children: React.ReactNode
}

const CreateGroupLayout = ({ children }: Props) => {
    return (
        <div className="container h-screen grid grid-cols-1 lg:grid-cols-2 content-center">
            <div className="flex items-center">
                <BackdropGradient className="w-8/12 h-2/6 opacity-50">
                    <Link
                        className="text-2xl font-bold text-themeTextWhite"
                        href={"/"}
                    >
                        <h5>GrowthHungry.</h5>
                    </Link>
                    <GradientText
                        element="H2"
                        className="text-4xl font-semibold py-1 my-4"
                    >
                        Create Your Group
                    </GradientText>
                    <p className="text-themeTextGray">
                        Free for 7 days, then $10/month. Cancel anytime.
                        <br />
                        All features. Unlimited everything. No hidden fees.
                    </p>
                    <div className="flex flex-col gap-3 mt-16 pl-5">
                        {GH_CONSTANTS.createGroupPlaceholder.map(
                            (placeholder) => (
                                <div
                                    className="flex gap-3"
                                    key={placeholder.id}
                                >
                                    <div className="mt-1">
                                        {placeholder.icon}
                                    </div>
                                    <p className="text-themeTextGray">
                                        {placeholder.label}
                                    </p>
                                </div>
                            ),
                        )}
                    </div>
                </BackdropGradient>
            </div>
            <div>
                <BackdropGradient
                    className="w-6/12 h-3/6 opacity-40"
                    container="lg:items-center"
                >
                    <GlassCard className="xs:w-full lg:w-10/12 xl:w-8/12 mt-16 py-7">
                        {children}
                    </GlassCard>
                </BackdropGradient>
            </div>
        </div>
    )
}

export default CreateGroupLayout
