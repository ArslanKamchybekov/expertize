import BackdropGradient from "@/components/global/backdrop-gradient"
import GlassCard from "@/components/global/glass-card"
import GradientText from "@/components/global/gradient-text"
import { APP_CONSTANTS } from "@/constants"
import Link from "next/link"

type Props = {
    children: React.ReactNode
}

const CreateGroupLayout = ({ children }: Props) => {
    return (
        <div className="container h-screen grid grid-cols-1 md:grid-cols-2 content-center px-4 md:px-10">
            {/* Left Side */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <BackdropGradient className="w-full md:w-8/12 lg:w-6/12 h-2/6 opacity-50">
                    <Link className="text-2xl font-bold text-themeTextWhite" href={"/"}>
                        <h5>Expertize.</h5>
                    </Link>
                    <GradientText element="H2" className="text-3xl md:text-4xl font-semibold py-1 my-4">
                        Create Your Group
                    </GradientText>
                    <p className="text-themeTextGray text-base md:text-lg">
                        Free for 7 days, then $10/month. Cancel anytime.
                        <br />
                        All features. Unlimited everything. No hidden fees.
                    </p>
                    <div className="flex flex-col gap-3 mt-10 md:mt-16">
                        {APP_CONSTANTS.createGroupPlaceholder.map((placeholder) => (
                            <div className="flex items-center gap-3" key={placeholder.id}>
                                <div className="text-xl">{placeholder.icon}</div>
                                <p className="text-themeTextGray text-sm md:text-base">{placeholder.label}</p>
                            </div>
                        ))}
                    </div>
                </BackdropGradient>
            </div>

            {/* Right Side */}
            <div className="flex justify-center md:justify-end">
                <BackdropGradient className="w-full md:w-10/12 lg:w-8/12 h-auto opacity-40 flex items-center">
                    <GlassCard className="w-full sm:w-11/12 md:w-10/12 xl:w-8/12 mt-10 md:mt-16 py-7 px-5">
                        {children}
                    </GlassCard>
                </BackdropGradient>
            </div>
        </div>
    )
}

export default CreateGroupLayout
