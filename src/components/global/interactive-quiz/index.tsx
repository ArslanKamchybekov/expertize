"use client"

import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"

type QuizTopic = {
    topic: string
    questions: {
        question: string
        choices: string[]
        correctAnswer: string
    }[]
}

type QuizProps = {
    transcript: string
}

export const InteractiveQuiz = ({ transcript }: QuizProps) => {
    const [topics, setTopics] = useState<QuizTopic[]>([])
    const [currentTopicIndex, setCurrentTopicIndex] = useState(0)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [userAnswers, setUserAnswers] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [feedback, setFeedback] = useState<string | null>(null)

    const fetchQuizData = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch("/api/generate-quiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript }),
            })

            const data = await response.json()

            if (response.ok) {
                setTopics(data.topics)
            } else {
                setError(data.error || "Failed to fetch quiz data.")
            }
        } catch (err) {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleAnswer = (answer: string) => {
        const currentTopic = topics[currentTopicIndex]
        const currentQuestion = currentTopic.questions[currentQuestionIndex]

        if (answer === currentQuestion.correctAnswer) {
            setFeedback("Correct! Well done.")
            if (currentQuestionIndex < currentTopic.questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1)
            } else {
                setCurrentTopicIndex(currentTopicIndex + 1)
                setCurrentQuestionIndex(0)
            }
        } else {
            setFeedback(
                `Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`,
            )
        }

        setUserAnswers((prev) => [...prev, answer])
    }

    const retryCurrentTopic = async () => {
        setFeedback(null)
        setError(null)
        setLoading(true)

        try {
            const response = await fetch("/api/regenerate-questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    topic: topics[currentTopicIndex].topic,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                const updatedTopics = [...topics]
                updatedTopics[currentTopicIndex].questions = data.newQuestions
                setTopics(updatedTopics)
                setCurrentQuestionIndex(0)
            } else {
                setError(data.error || "Failed to fetch new questions.")
            }
        } catch (err) {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const skipCurrentTopic = () => {
        if (currentTopicIndex < topics.length - 1) {
            setCurrentTopicIndex(currentTopicIndex + 1)
            setCurrentQuestionIndex(0)
            setFeedback(null)
        }
    }

    return (
        <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
            {/* For premium users only */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl mb-4 text-gray-100 font-bold">
                    Interactive Quiz
                </h3>
                <p className="text-green-400 font-bold text-xl flex items-center gap-2">
                    GH Premium
                </p>
            </div>
            <Button onClick={fetchQuizData} disabled={loading}>
                {loading ? (
                    <Loader loading={loading}>Generating Quiz...</Loader>
                ) : (
                    "Start Quiz"
                )}
            </Button>
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {/* Dynamic Progress Indicator */}
            {topics.length > 0 && (
                <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
                    <div
                        style={{
                            width: `${
                                ((currentTopicIndex *
                                    topics[0].questions.length +
                                    currentQuestionIndex) /
                                    (topics.length *
                                        topics[0].questions.length)) *
                                100
                            }%`,
                        }}
                        className="h-full bg-green-400 rounded-full transition-all duration-300"
                    ></div>
                </div>
            )}

            {topics.length > 0 && currentTopicIndex < topics.length && (
                <div className="mt-6">
                    {/* Friendly Topic Introduction */}
                    {feedback === null && currentQuestionIndex === 0 && (
                        <p className="mt-4 text-gray-300 italic mb-4">
                            Let&apos;s dive into the topic:{" "}
                            <span className="text-white font-bold">
                                {topics[currentTopicIndex].topic}
                            </span>
                        </p>
                    )}
                    <h3 className="text-xl font-semibold text-gray-100">
                        Topic: {topics[currentTopicIndex].topic}
                    </h3>
                    <p className="mt-4 text-gray-200">
                        {
                            topics[currentTopicIndex].questions[
                                currentQuestionIndex
                            ].question
                        }
                    </p>
                    <RadioGroup
                        className="mt-4"
                        onValueChange={(value) => handleAnswer(value)}
                    >
                        {topics[currentTopicIndex].questions[
                            currentQuestionIndex
                        ].choices.map((choice, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-3"
                            >
                                <RadioGroupItem
                                    value={choice}
                                    id={`choice-${index}`}
                                />
                                <Label htmlFor={`choice-${index}`}>
                                    {choice}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>

                    {/* Interactive Feedback Animation */}
                    {feedback && (
                        <div
                            className={`mt-4 p-4 border rounded-lg animate__animated ${
                                feedback.startsWith("Correct")
                                    ? "border-green-400 bg-green-50 text-green-800 animate__pulse"
                                    : "border-red-400 bg-red-50 text-red-800 animate__shakeX"
                            }`}
                        >
                            <p className="font-semibold">GrowthHungry AI:</p>
                            <p className="mt-2">{feedback}</p>
                        </div>
                    )}

                    {/* Retry Button for Incorrect Answers */}
                    {feedback && !feedback.startsWith("Correct") && (
                        <Button onClick={retryCurrentTopic} className="mt-4">
                            {loading ? (
                                <Loader loading={loading}>Retrying...</Loader>
                            ) : (
                                "Retry Topic"
                            )}
                        </Button>
                    )}

                    <Button
                        onClick={skipCurrentTopic}
                        className="mt-4 bg-black text-white"
                    >
                        Skip Topic
                    </Button>
                </div>
            )}

            {/* End Quiz Call-to-Action */}
            {topics.length > 0 && currentTopicIndex >= topics.length && (
                <div className="mt-6 text-center">
                    <p className="text-lg text-green-400">
                        Congratulations! You&apos;ve completed the quiz.
                    </p>
                    {/* <Button onClick={exploreMoreTopics} className="mt-4">
                        Explore More Topics
                    </Button> */}
                </div>
            )}
        </div>
    )
}
