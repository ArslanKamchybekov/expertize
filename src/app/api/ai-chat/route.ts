import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
    
// export default async function POST(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     const { lectureContent, question } = req.body;

//     if (!lectureContent || !question) {
//       return res.status(400).json({ error: "Invalid input" });
//     }

//     try {
//       const response = await openai.chat.completions.create({
//         model: "gpt-4o",
//         messages: [
//           { role: "system", content: `You are an expert assistant helping with lecture content.` },
//           { role: "user", content: `Lecture: ${lectureContent}\n\nQuestion: ${question}` },
//         ],
//       });

//       const answer = response.choices[0]?.message?.content || "No answer found.";
//       return res.status(200).json({ answer });
//     } catch (error) {
//       console.error("Error in AI chat:", error);
//       return res.status(500).json({ error: "Failed to process the request" });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }


export async function POST(req: Request) {
  try {
    const { lectureContent, question } = await req.json(); // Parse the request body

    // Here you can integrate your AI service to process the question
    const answer = await getAIAnswer(lectureContent, question);

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Error in AI Chat API:", error);
    return NextResponse.error();
  }
}

async function getAIAnswer(lectureContent: string, question: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: `You are an expert assistant helping with lecture content.` },
      { role: "user", content: `Lecture: ${lectureContent}\n\nQuestion: ${question}` },
    ],
  });

  return response.choices[0]?.message?.content || "No answer found.";
}