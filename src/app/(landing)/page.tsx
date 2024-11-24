import dynamic from "next/dynamic"
import CallToAction from "./_components/call-to-action"
import DashboardSnippet from "./_components/dashboard-snippet"

const PricingSection = dynamic(
    () =>
        import("./_components/pricing").then(
            (component) => component.PricingSection,
        ),
    { ssr: true },
)

const FeedbackSection = dynamic(
    () =>
        import("./_components/feedback").then(
            (component) => component.FeedbackSection,
        ),
    { ssr: true },
)

export default function Home() {
    return (
        <main className="md:px-10 py-20 flex flex-col gap-36">
            <div>
                <CallToAction />
                <DashboardSnippet />
            </div>
            <PricingSection />
            <FeedbackSection />

            {/* Footer */}
            <footer className="text-white text-center">
                <p>
                    &copy; 2025 <span className="font-bold">GrowthHungry.</span>{" "}
                    All rights reserved.
                </p>
                <p className="text-sm mt-2">
                    Built by{" "}
                    <a
                        href="https://arslankamchybekov.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-themeBlue underline"
                    >
                        Arslan Kamchybekov |{" "}
                    </a>
                    <a
                        href="https://www.growthhungry.life/en"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <span className="text-themeBlue underline">
                            GrowthHungry
                        </span>
                    </a>
                </p>
            </footer>
        </main>
    )
}
