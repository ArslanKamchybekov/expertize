import * as monaco from "monaco-editor"
import { useEffect, useRef, useState } from "react"

interface CodeEditorProps {
    language?: string
    theme?: string
    defaultCode?: string
    readOnly?: boolean
    height?: string
    onCodeChange?: (value: string) => void
}

const CodeEditor = ({
    language = "java",
    theme = "vs-dark",
    defaultCode = `public class Main {
    public static void main(String[] args) {
        // Your code starts here
        System.out.println("Hello, World!");
    }
}`,
    onCodeChange,
    readOnly = false,
    height = "300px",
}: CodeEditorProps) => {
    const editorRef = useRef(null)
    const [editorInstance, setEditorInstance] =
        useState<monaco.editor.IStandaloneCodeEditor | null>(null)

    useEffect(() => {
        if (!editorRef.current) return

        const editor = monaco.editor.create(editorRef.current, {
            value: defaultCode,
            language,
            theme,
            automaticLayout: true,
            fontSize: 16,
            lineNumbers: "on",
            readOnly: readOnly,
        })

        setEditorInstance(editor)

        return () => editor.dispose()
    }, [])

    useEffect(() => {
        if (editorInstance && onCodeChange) {
            const model = editorInstance.getModel()
            if (model) {
                const subscription = model.onDidChangeContent(() => {
                    onCodeChange(model.getValue())
                })

                return () => subscription.dispose()
            }
        }
    }, [editorInstance, onCodeChange])

    useEffect(() => {
        if (!editorInstance) return

        monaco.languages.registerCompletionItemProvider(language, {
            provideCompletionItems: () => ({
                suggestions: [
                    {
                        label: "System.out.println",
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: "System.out.println(${1});",
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        range:
                            editorInstance.getModel()?.getFullModelRange() ||
                            new monaco.Range(1, 1, 1, 1),
                        documentation: "Prints a line to the console.",
                    },
                    {
                        label: "main",
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: `public static void main(String[] args) {\n\t$1\n}`,
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        range:
                            editorInstance.getModel()?.getFullModelRange() ||
                            new monaco.Range(1, 1, 1, 1),
                        documentation: "Creates the main method.",
                    },
                    {
                        label: "class",
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: `public class \${1:ClassName} {\n\t\${2}\n}`,
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        range:
                            editorInstance.getModel()?.getFullModelRange() ||
                            new monaco.Range(1, 1, 1, 1),
                        documentation: "Creates a new class.",
                    },
                ],
            }),
        })
    }, [editorInstance, language])

    return <div ref={editorRef} style={{ height: height, width: "100%" }} />
}

export default CodeEditor
