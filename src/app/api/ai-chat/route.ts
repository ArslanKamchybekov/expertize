import { NextResponse } from "next/server"
import { OpenAI } from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})


export async function POST(req: Request) {
    try {
        const { lectureContent, question } = await req.json()
        const answer = await getAIAnswer(lectureContent, question)
        return NextResponse.json({ answer })
    } catch (error) {
        console.error("Error in AI Chat API:", error)
        return NextResponse.error()
    }
}

async function getAIAnswer(lectureContent: string, question: string) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: `You are an expert assistant helping with lecture content.`,
            },
            {
                role: "user",
                content: `Lecture: ${lectureContent}\n\nQuestion: ${question}`,
            },
        ],
    })

    return response.choices[0]?.message?.content || "No answer found."
}
