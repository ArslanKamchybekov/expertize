"use client"

import { Button } from "@/components/ui/button"

type Props = {}

export const FeedbackSection = (props: Props) => {
    return (
        <div
            className="w-full pt-20 flex flex-col items-center gap-3"
            id="feedback"
        >
            <section className="bg-themeBlue text-white py-20">
                <div className="container mx-auto">
                    <h2
                        className="text-3xl font-bold mb-4 text-center
                    "
                    >
                        Feedback
                    </h2>
                    <p className="text-lg my-8">
                        We are always looking for ways to improve our platform.
                        If you have any feedback, please let us know.
                    </p>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={(e) => {
                            e.preventDefault()
                            const feedback = (
                                e.target as HTMLFormElement
                            ).elements.namedItem(
                                "feedback",
                            ) as HTMLTextAreaElement
                            const feedbackValue = feedback.value
                            window.location.href = `mailto:kamchybekov.arslan.us@gmail.com?subject=Feedback&body=${encodeURIComponent(
                                feedbackValue,
                            )}`
                        }}
                    >
                        <textarea
                            name="feedback"
                            id="feedback"
                            className="w-full h-40 bg-white rounded-md p-4 text-black"
                            placeholder="Enter your feedback here..."
                        ></textarea>
                        <Button
                            type="submit"
                            variant="secondary"
                            className="w-full"
                        >
                            Submit Feedback
                        </Button>
                    </form>
                </div>
            </section>
        </div>
    )
}
