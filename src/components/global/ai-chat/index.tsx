"use client"

import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"

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
                className="w-full p-3 bg-gray-800 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
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
                    <ReactMarkdown
                        className="prose prose-invert text-gray-300 mt-2"
                        components={{
                            code({
                                node,
                                inline,
                                className,
                                children,
                                ...props
                            }: any) {
                                const match = /language-(\w+)/.exec(
                                    className || "",
                                )
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                    >
                                        {String(children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code
                                        className={`bg-gray-700 text-purple-300 rounded px-1 py-0.5 ${
                                            className || ""
                                        }`}
                                        {...props}
                                    >
                                        {children}
                                    </code>
                                )
                            },
                            a({ href, children }) {
                                return (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-purple-500 underline hover:text-purple-400"
                                    >
                                        {children}
                                    </a>
                                )
                            },
                            blockquote({ children }) {
                                return (
                                    <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-400">
                                        {children}
                                    </blockquote>
                                )
                            },
                            ul({ children }) {
                                return (
                                    <ul className="list-disc ml-6">
                                        {children}
                                    </ul>
                                )
                            },
                            ol({ children }) {
                                return (
                                    <ol className="list-decimal ml-6">
                                        {children}
                                    </ol>
                                )
                            },
                            h1({ children }) {
                                return (
                                    <h1 className="text-2xl font-bold mt-4">
                                        {children}
                                    </h1>
                                )
                            },
                            h2({ children }) {
                                return (
                                    <h2 className="text-xl font-semibold mt-3">
                                        {children}
                                    </h2>
                                )
                            },
                            h3({ children }) {
                                return (
                                    <h3 className="text-lg font-semibold mt-2">
                                        {children}
                                    </h3>
                                )
                            },
                        }}
                    >
                        {answer}
                    </ReactMarkdown>
                    ;
                </div>
            )}
        </div>
    )
}
