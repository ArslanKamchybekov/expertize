"use client"

import { AIChat } from "@/components/global/ai-chat"
import { HtmlParser } from "@/components/global/html-parser"
import { Loader } from "@/components/global/loader"
import { QuizGenerator } from "@/components/global/quiz-generator"
import BlockTextEditor from "@/components/global/rich-text-editor"
import { Button } from "@/components/ui/button"
import { useCourseContent, useCourseSectionInfo } from "@/hooks/courses"
import { useEffect, useState } from "react"
import { YoutubeTranscript } from "youtube-transcript"

type CourseContentFormProps = {
    sectionid: string
    userid: string
    groupid: string
}

export const CourseContentForm = ({
    sectionid,
    userid,
    groupid,
}: CourseContentFormProps) => {
    const { data } = useCourseSectionInfo(sectionid)

    const {
        errors,
        onUpdateContent,
        setJsonDescription,
        setOnDescription,
        onEditDescription,
        setOnHtmlDescription,
        editor,
        isPending,
    } = useCourseContent(
        sectionid,
        data?.section?.content || null,
        data?.section?.JsonContent || null,
        data?.section?.htmlContent || null,
    )

    const [isEditing, setIsEditing] = useState(false)
    const [transcriptText, setTranscriptText] = useState<string>("")
    const lectureContent = data?.section?.htmlContent || ""

    useEffect(() => {
        const fetchTranscript = async () => {
            const videoIdMatch = lectureContent.match(
                /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
            )
            const videoId = videoIdMatch ? videoIdMatch[1] : null

            if (videoId) {
                try {
                    const transcript =
                        await YoutubeTranscript.fetchTranscript(videoId)
                    const combinedText = transcript
                        .map((item) => item.text)
                        .join(" ")
                    setTranscriptText(combinedText)
                } catch (error) {
                    console.error("Failed to fetch transcript:", error)
                }
            }
        }

        fetchTranscript()
    }, [lectureContent])

    const handleDescriptionClick = () => {
        setIsEditing(true)
    }

    const handleDescriptionBlur = () => {
        setIsEditing(false)
    }

    return groupid === userid ? (
        <form
            onSubmit={onUpdateContent}
            className="p-4 flex flex-col gap-4"
            ref={editor}
        >
            <div
                onClick={handleDescriptionClick}
                onBlur={handleDescriptionBlur}
                tabIndex={0}
            >
                <BlockTextEditor
                    onEdit={onEditDescription}
                    max={10000}
                    inline
                    min={100}
                    disabled={userid !== groupid}
                    name="jsoncontent"
                    errors={errors}
                    setContent={setJsonDescription || undefined}
                    content={JSON.parse(data?.section?.JsonContent!)}
                    htmlContent={data?.section?.htmlContent || undefined}
                    setHtmlContent={setOnHtmlDescription}
                    textContent={data?.section?.content || undefined}
                    setTextContent={setOnDescription}
                />
            </div>

            {onEditDescription && (
                <Button
                    className="self-end bg-themeBlack border-themeGray"
                    variant="outline"
                >
                    <Loader loading={isPending}>Save Content</Loader>
                </Button>
            )}

            {!isEditing && (
                <AIChat lectureContent={transcriptText || lectureContent} />
            )}
            {!isEditing && (
                <QuizGenerator
                    lectureContent={transcriptText || lectureContent}
                />
            )}
        </form>
    ) : (
        <form className="p-4 flex flex-col gap-4">
            <HtmlParser html={data?.section?.htmlContent!} />
            <AIChat lectureContent={transcriptText || lectureContent} />
            <QuizGenerator lectureContent={transcriptText || lectureContent} />
        </form>
    )
}
