"use client"

import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import ReactMarkdown from "react-markdown"

type AIChatProps = {
    lectureContent: string
}

export const AIChat = ({ lectureContent }: AIChatProps) => {
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [loading, setLoading] = useState(false)

    const handleAskQuestion = async () => {
        if (!question.trim()) return

        setLoading(true)
        try {
            const response = await fetch("/api/ai-chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ lectureContent, question }),
            })
            const data = await response.json()
            setAnswer(data.answer)
        } catch (error) {
            setAnswer("Oops! Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-5 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-100">
                GrowthHungry AI
            </h3>
            <textarea
                className="w-full p-3 bg-gray-800 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700"
                placeholder="Ask a question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            <Button
                onClick={handleAskQuestion}
                disabled={loading}
                className="mt-4"
            >
                <Loader loading={loading}>Let&apos;s learn!</Loader>
            </Button>
            {answer && (
                <div className="mt-5 p-4 bg-gray-800 border border-gray-600 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-400">
                        GrowthHungry AI:
                    </h4>
                    <ReactMarkdown className={"text-gray-300 mt-2"}>
                        {answer}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    )
}
