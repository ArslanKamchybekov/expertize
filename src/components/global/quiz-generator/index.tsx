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
            const response = await fetch("/api/generate-quick-quiz", {
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

    const resetQuiz = () => {
        setUserAnswers({})
        setScore(null)
    }

    return (
        <div className="p-5 bg-gray-900 border border-gray-700 rounded-lg shadow-lg transition-all">
            <h3 className="text-xl mb-4 text-gray-100 font-bold">
                Quick Quiz
            </h3>
            <Button
                onClick={generateQuiz}
                disabled={loading}
                className="px-4 py-2 rounded"
            >
                <Loader loading={loading}>Generate Quiz</Loader>
            </Button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {quiz.length > 0 && (
                <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg my-4 transition-all">
                    <h3 className="text-lg font-bold text-gray-100">
                        Test Your Knowledge
                    </h3>
                    <ul className="mt-4 space-y-6">
                        {quiz.map((q, index) => (
                            <li
                                key={index}
                                className={`p-4 rounded-md border-2 transition-all ${
                                    score !== null &&
                                    userAnswers[index] === q.correctAnswer
                                        ? "border-green-500"
                                        : score !== null
                                          ? "border-red-500"
                                          : "border-gray-700"
                                }`}
                            >
                                <p className="text-gray-100 font-semibold">
                                    Q{index + 1}: {q.question}
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
                                            className={`flex items-center space-x-2 ${
                                                score !== null &&
                                                choice === q.correctAnswer
                                                    ? "text-green-400"
                                                    : ""
                                            }`}
                                        >
                                            <RadioGroupItem
                                                value={choice}
                                                id={`q-${index}-choice-${i}`}
                                                className="bg-gray-700 text-gray-100 checked:bg-blue-600"
                                            />
                                            <Label
                                                htmlFor={`q-${index}-choice-${i}`}
                                            >
                                                {choice}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </li>
                        ))}
                    </ul>
                    {score === null ? (
                        <div className="flex justify-between items-center mt-4">
                            <Button
                                onClick={checkAnswers}
                                className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
                            >
                                Submit Answers
                            </Button>
                            <div className="text-gray-400">
                                Progress: {Object.keys(userAnswers).length}/
                                {quiz.length}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4 text-center">
                            <p className="text-2xl text-gray-100 font-bold my-2">
                                Your Score: {score}/{quiz.length}
                            </p>
                            {score === quiz.length ? (
                                <p className="text-green-500">
                                    🎉 Perfect Score! Great Job! 🎉
                                </p>
                            ) : score > quiz.length / 2 ? (
                                <p className="text-yellow-400">
                                    👍 Good Effort! Keep Going!
                                </p>
                            ) : (
                                <p className="text-red-500">
                                    😔 Ask AI for help and try again!
                                </p>
                            )}
                            <Button
                                onClick={resetQuiz}
                                className="px-4 py-2 rounded mt-4"
                            >
                                Retry Quiz
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
