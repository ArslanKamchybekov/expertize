import * as monaco from "monaco-editor";
import { useEffect, useRef, useState } from "react";

interface CodeEditorProps {
    language?: string;
    theme?: string;
    defaultCode?: string;
    readOnly?: boolean;
    height?: string;
    onCodeChange?: (value: string) => void;
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
    const editorRef = useRef<HTMLDivElement>(null);
    const [editorInstance, setEditorInstance] =
        useState<monaco.editor.IStandaloneCodeEditor | null>(null);

    useEffect(() => {
        if (!editorRef.current) return;

        const editor = monaco.editor.create(editorRef.current, {
            value: defaultCode,
            language,
            theme,
            automaticLayout: true,
            fontSize: 16,
            lineNumbers: "on",
            readOnly,
        });

        setEditorInstance(editor);

        return () => {
            if (editor) {
                editor.dispose();
            }
        };
    }, [language, theme, readOnly]);

    useEffect(() => {
        if (editorInstance) {
            const currentValue = editorInstance.getValue();
            if (currentValue !== defaultCode) {
                const range = editorInstance.getModel()?.getFullModelRange();
                if (range) {
                    editorInstance.executeEdits("", [
                        {
                            range,
                            text: defaultCode,
                            forceMoveMarkers: true,
                        },
                    ]);
                }
            }
        }
    }, [defaultCode, editorInstance]);

    useEffect(() => {
        if (editorInstance && onCodeChange) {
            const model = editorInstance.getModel();
            if (model) {
                const subscription = model.onDidChangeContent(() => {
                    onCodeChange(model.getValue());
                });

                return () => subscription.dispose();
            }
        }
    }, [editorInstance, onCodeChange]);

    return <div ref={editorRef} style={{ height, width: "100%" }} />;
};

export default CodeEditor;
