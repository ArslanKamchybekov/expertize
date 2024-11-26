"use client";

import { AIChat } from "@/components/global/ai-chat";
import { HtmlParser } from "@/components/global/html-parser";
import { Loader } from "@/components/global/loader";
import BlockTextEditor from "@/components/global/rich-text-editor";
import { Button } from "@/components/ui/button";
import { useCourseContent, useCourseSectionInfo } from "@/hooks/courses";
import { useState } from "react";

type CourseContentFormProps = {
    sectionid: string;
    userid: string;
    groupid: string;
};

export const CourseContentForm = ({
    sectionid,
    userid,
    groupid,
}: CourseContentFormProps) => {
    const { data } = useCourseSectionInfo(sectionid);

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
        data?.section?.htmlContent || null
    );

    const [isEditing, setIsEditing] = useState(false); // State to track if the description is being edited
    const lectureContent = data?.section?.htmlContent || "";

    // Handle when the user clicks on the description to edit
    const handleDescriptionClick = () => {
        setIsEditing(true);
    };

    // Handle when the user exits editing
    const handleDescriptionBlur = () => {
        setIsEditing(false);
    };

    return groupid === userid ? (
        <form
            onSubmit={onUpdateContent}
            className="p-4 flex flex-col gap-4"
            ref={editor}
        >
            <div
                onClick={handleDescriptionClick} // Allow user to start editing by clicking
                onBlur={handleDescriptionBlur} // Stop editing when clicking outside
                tabIndex={0} // Ensures onBlur is triggered when the input loses focus
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

            {/* Show AIChat only when not editing */}
            {!isEditing && <AIChat lectureContent={lectureContent} />}
        </form>
    ) : (
        <form className="p-4 flex flex-col gap-4">
            <HtmlParser html={data?.section?.htmlContent!} />
            <AIChat lectureContent={lectureContent} />
        </form>
    );
};
