import { useState } from "react"
import { LANGUAGE_CONFIGS } from "../../../constants/languages"
import CodeEditor from "../code-editor"
import { DropDown } from "../drop-down"
import { Loader } from "../loader"

type LanguageKey = keyof typeof LANGUAGE_CONFIGS

const IDE = () => {
    const [language, setLanguage] = useState<LanguageKey>("java")
    const [code, setCode] = useState(LANGUAGE_CONFIGS.java.defaultCode)
    const [output, setOutput] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLanguageChange = (newLanguage: LanguageKey) => {
        setLanguage(newLanguage)
        setCode(LANGUAGE_CONFIGS[newLanguage].defaultCode)
        setOutput("")
    }

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
                        language_id: LANGUAGE_CONFIGS[language].id,
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

            if (result.stdout) {
                setOutput(atob(result.stdout))
            } else if (result.stderr) {
                setOutput(atob(result.stderr))
            } else if (result.compile_output) {
                setOutput(atob(result.compile_output))
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
                <div className="flex items-center justify-between gap-4 pb-6">
                    <h3 className="text-xl text-gray-100 font-bold">
                        Online IDE
                    </h3>
                    <p className="text-green-400 font-bold text-xl flex items-center gap-2">
                        GH Premium
                    </p>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={(event) => {
                            event.preventDefault()
                            executeCode()
                        }}
                        disabled={loading}
                        className={`${loading ? "bg-gray-500" : "bg-gray-700"} hover:bg-gray-600 text-white font-bold py-2 px-4 rounded`}
                    >
                        {loading ? (
                            <Loader loading={true}>Loading...</Loader>
                        ) : (
                            "Execute"
                        )}
                    </button>

                    <DropDown
                        title="Select Language"
                        trigger={
                            <button className="bg-gray-700 text-gray-200 font-bold py-2 px-4 rounded">
                                {LANGUAGE_CONFIGS[language].name}
                            </button>
                        }
                    >
                        <div className="py-2">
                            {(
                                Object.keys(LANGUAGE_CONFIGS) as LanguageKey[]
                            ).map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => handleLanguageChange(lang)}
                                    className="block w-full text-left py-2 px-4 hover:bg-gray-700 hover:text-white"
                                >
                                    {LANGUAGE_CONFIGS[lang].name}
                                </button>
                            ))}
                        </div>
                    </DropDown>
                </div>
            </div>

            <CodeEditor
                language={language === "cpp" ? "cpp" : language}
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
