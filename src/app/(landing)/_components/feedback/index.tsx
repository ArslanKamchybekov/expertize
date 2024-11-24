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
                    <h2 className="text-3xl font-bold mb-4">Feedback</h2>
                    <p className="text-lg mb-8">
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
                            window.location.href = `mailto:arslan@growthhungry.life?subject=Feedback&body=${encodeURIComponent(
                                feedbackValue,
                            )}`
                        }}
                    >
                        <textarea
                            name="feedback"
                            className="w-full h-40 p-4 bg-white rounded-lg text-themeBlack"
                            placeholder="Enter your feedback here"
                        ></textarea>
                        <Button
                            type="submit"
                            variant="outline"
                            className="w-40 bg-white text-themeBlack hover:bg-themeDarkGray hover:text-white"
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            </section>
        </div>
    )
}
