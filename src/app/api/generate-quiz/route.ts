import { NextResponse } from "next/server"
import { OpenAI } from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
    try {
        const { lectureContent } = await req.json()
        if (!lectureContent) {
            return NextResponse.json(
                { error: "Lecture content is required." },
                { status: 400 },
            )
        }

        const prompt = `
            Based on the following lecture content, create a multiple-choice quiz with 5 questions. 
            Each question should have:
            - A "question" string.
            - Four "choices" (array of strings).
            - An "answer" string (correct choice from "choices").
            ---
            Lecture Content:
            ${lectureContent}
            ---
            Output *only* valid JSON in this format:
            [
                {
                    "question": "What is the main idea?",
                    "choices": ["A", "B", "C", "D"],
                    "answer": "A"
                },
                ...
            ]
        `

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000,
        })

        const rawContent = response.choices[0].message?.content || "[]"

        let quiz = []
        try {
            const jsonMatch = rawContent.match(/\[.*\]/s)
            quiz = jsonMatch ? JSON.parse(jsonMatch[0]) : []
        } catch (parseError) {
            console.error(
                "Parsing Error:",
                parseError,
                "Raw Content:",
                rawContent,
            )
            return NextResponse.json(
                { error: "Failed to parse quiz from OpenAI response." },
                { status: 500 },
            )
        }

        quiz = quiz.map((q: any) => ({
            question: q.question || "No question provided.",
            choices: Array.isArray(q.choices) ? q.choices : [],
            correctAnswer: q.answer || "No answer provided.",
        }))

        return NextResponse.json({ quiz }, { status: 200 })
    } catch (error) {
        console.error("Error generating quiz:", error)
        return NextResponse.json(
            { error: "Failed to generate quiz." },
            { status: 500 },
        )
    }
}
