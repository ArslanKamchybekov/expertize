import { useState } from "react"
import CodeEditor from "../code-editor"
import { Loader } from "../loader"

const IDE = () => {
    const [code, setCode] = useState(`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`)
    const [output, setOutput] = useState("")
    const [loading, setLoading] = useState(false)

    const executeCode = async () => {
        setLoading(true)
        try {
            const response = await fetch(
                "https://judge0-ce.p.rapidapi.com/submissions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                        "x-rapidapi-key": `${process.env.NEXT_PUBLIC_RAPID_API_KEY}`,
                    },
                    body: JSON.stringify({
                        language_id: 62,
                        source_code: code,
                        stdin: "U25Wa1oyVXc=",
                    }),
                },
            )

            const data = await response.json()

            const token = data.token
            if (!token) {
                setOutput("Failed to submit code.")
                setLoading(false)
                return
            }

            let result
            while (true) {
                const resultResponse = await fetch(
                    `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true&fields=*`,
                    {
                        headers: {
                            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                            "x-rapidapi-key": `${process.env.NEXT_PUBLIC_RAPID_API_KEY}`,
                        },
                    },
                )

                result = await resultResponse.json()

                if (result.status.id !== 2) {
                    break
                }

                await new Promise((resolve) => setTimeout(resolve, 1000))
            }

            console.log("Final Result:", result)

            // Handle the result
            if (result.stdout) {
                setOutput(atob(result.stdout)) // Decode Base64 stdout
            } else if (result.stderr) {
                setOutput(atob(result.stderr)) // Decode Base64 stderr
            } else if (result.compile_output) {
                setOutput(atob(result.compile_output)) // Decode Base64 compile output
            } else {
                setOutput("Error occurred while executing code.")
            }
        } catch (error) {
            console.error("Error:", error)
            setOutput("An error occurred while running the code.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl text-gray-100 font-bold">
                        Online IDE
                    </h3>
                    <p className="text-green-400 font-bold text-xl flex items-center gap-2">
                        GH Premium
                    </p>
                </div>
                <button
                    onClick={(event) => {
                        event.preventDefault()
                        executeCode()
                    }}
                    disabled={loading}
                    className={`mb-4 ${loading ? "bg-gray-500" : "bg-green-500"} hover:bg-green-600 text-white font-bold py-2 px-4 rounded`}
                >
                    {loading ? (
                        <Loader loading={true}>Loading...</Loader>
                    ) : (
                        "Execute"
                    )}
                </button>
            </div>

            <CodeEditor
                language="java"
                onCodeChange={setCode}
                defaultCode={code}
            />

            {output && (
                <div className="mt-4">
                    <CodeEditor
                        language="text"
                        theme="vs-dark"
                        defaultCode={output}
                        readOnly={true}
                        onCodeChange={() => {}}
                        height="150px"
                    />
                </div>
            )}
        </div>
    )
}

export default IDE
