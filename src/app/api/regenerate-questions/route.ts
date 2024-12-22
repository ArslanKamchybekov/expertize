import { NextResponse } from "next/server"
import { OpenAI } from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
    const { topic } = await req.json()

    if (!topic) {
        return NextResponse.json(
            { error: "Topic is required" },
            { status: 400 },
        )
    }

    try {
        // Generate new question types for the topic
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an educational assistant.",
                },
                {
                    role: "user",
                    content: `Generate 3 new questions of a different type for the topic "${topic}". Use a mix of true/false, fill-in-the-blank, or short-answer questions. Provide the output as a valid JSON array with this structure:
                        [
                            {
                                "question": "What is the capital of France?",
                                "choices": ["Paris", "London", "Berlin", "Madrid"],
                                "correctAnswer": "Paris"
                            },
                            ...
                        ]
                        Do not include anything else or any comments, besides the JSON itself.
                    `,
                },
            ],
        })

        const newQuestions = JSON.parse(
            response.choices[0].message?.content || "[]",
        )
        return NextResponse.json({ newQuestions })
    } catch (error: any) {
        console.error(error)
        return NextResponse.json(
            { error: "Failed to generate new questions" },
            { status: 500 },
        )
    }
}
