import { NextResponse } from "next/server"
import { OpenAI } from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {

    const { transcript } = await req.json()

    if (!transcript) {
        return NextResponse.json({ error: "Transcript is required" }, { status: 400 })
    }

    try {
        // Step 1: Extract main topics
        const topicResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an educational assistant.",
                },
                {
                    role: "user",
                    content: `Extract the main topics from this lecture transcript: ${transcript}. Provide the topics as a plain comma-separated list.`,
                },
            ],
        })

        const topics = topicResponse.choices[0].message?.content?.split(",")

        if (!topics || topics.length === 0) {
            throw new Error("Failed to extract topics")
        }

        // Step 2: Generate questions for each topic
        const quiz = []

        for (const topic of topics) {
            const questionResponse = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are an educational assistant.",
                    },
                    {
                        role: "user",
                        content: `Generate 3 multiple-choice questions for the topic "${topic}". Provide the output as a valid JSON array with this structure:
                        [
                            {
                                "question": "What is the capital of France?",
                                "choices": ["Paris", "London", "Berlin", "Madrid"],
                                "correctAnswer": "Paris"
                            },
                            ...
                        ]`
                    }
                ],
            })

            const questions = JSON.parse(questionResponse.choices[0].message?.content || "[]")

            quiz.push({
                topic: topic.trim(),
                questions,
            })
        }

        console.log("Generated quiz:", quiz)

        return NextResponse.json({ topics: quiz })
    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 })
    }
}
