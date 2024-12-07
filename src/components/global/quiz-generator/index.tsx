"use client"

import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"

type QuizQuestion = {
    question: string
    choices: string[]
    correctAnswer: string
}

type QuizProps = {
    lectureContent: string
}

export const QuizGenerator = ({ lectureContent }: QuizProps) => {
    const [quiz, setQuiz] = useState<QuizQuestion[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
    const [score, setScore] = useState<number | null>(null)

    const generateQuiz = async () => {
        setLoading(true)
        setError(null)
        setScore(null)

        try {
            const response = await fetch("/api/generate-quiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lectureContent }),
            })

            const data = await response.json()
            if (response.ok) {
                setQuiz(data.quiz)
            } else {
                setError(data.error || "Failed to generate quiz.")
            }
        } catch (err) {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleAnswerChange = (questionIndex: number, answer: string) => {
        setUserAnswers((prev) => ({ ...prev, [questionIndex]: answer }))
    }

    const checkAnswers = () => {
        let correctCount = 0
        quiz.forEach((q, index) => {
            if (userAnswers[index] === q.correctAnswer) {
                correctCount++
            }
        })
        setScore(correctCount)
    }

    return (
        <div className="p-5 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
            <h3 className="text-xl mb-4 text-gray-100 font-bold">Generate Quiz</h3>
            <Button
                onClick={generateQuiz}
                disabled={loading}
                className="px-4 py-2 rounded"
            >
                <Loader loading={loading}>Let&apos;s go!</Loader>
            </Button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {quiz.length > 0 && (
                <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg my-4">
                    <h3 className="text-lg font-bold text-purple-400">
                        Time to take the quiz!
                    </h3>
                    <ul className="mt-4 space-y-6">
                        {quiz.map((q, index) => (
                            <li
                                key={index}
                                className="bg-gray-900 p-4 rounded-md"
                            >
                                <p className="text-gray-100 font-semibold">
                                    {q.question}
                                </p>
                                <RadioGroup
                                    value={userAnswers[index] || ""}
                                    onValueChange={(value) =>
                                        handleAnswerChange(index, value)
                                    }
                                    className="mt-4 space-y-2"
                                >
                                    {q.choices.map((choice, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center space-x-2"
                                        >
                                            <RadioGroupItem
                                                value={choice}
                                                id={`q-${index}-choice-${i}`}
                                                className="bg-gray-700 text-gray-100 checked:bg-white checked:text-black"
                                            />
                                            <Label
                                                htmlFor={`q-${index}-choice-${i}`}
                                            >
                                                {choice}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                                {score !== null && (
                                    <p
                                        className={`mt-2 text-sm ${
                                            userAnswers[index] ===
                                            q.correctAnswer
                                                ? "text-green-400"
                                                : "text-red-400"
                                        }`}
                                    >
                                        {userAnswers[index] === q.correctAnswer
                                            ? "Correct"
                                            : `Incorrect. Correct answer: ${q.correctAnswer}`}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                    {score === null ? (
                        <Button
                            onClick={checkAnswers}
                            className="mt-4 font-bold bg-purple-600 text-white px-4 py-2 rounded"
                        >
                            Check Answers
                        </Button>
                    ) : (
                        <p className="mt-4 text-gray-100">
                            Your Score: {score}/{quiz.length}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
